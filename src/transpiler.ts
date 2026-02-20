import ts from 'typescript';

export interface TranspilerOptions {
    sdkVersion?: string;
    udonSharpVersion?: string;
}

export class Transpiler {
    private readonly sourceFile: ts.SourceFile;
    private indentLevel: number = 0;
    private readonly options: TranspilerOptions;

    constructor(sourceCode: string, options: TranspilerOptions = {}) {
        this.sourceFile = ts.createSourceFile('script.ts', sourceCode, ts.ScriptTarget.Latest, true);
        this.options = options;
    }

    public transpile(): string {
        return this.visit(this.sourceFile);
    }

    private visit(node: ts.Node): string {
        if (ts.isSourceFile(node)) {
            return node.statements
                .filter(s => !ts.isImportDeclaration(s))
                .filter(s => !ts.isVariableStatement(s) || !s.declarationList.declarations.some(d => {
                    const name = d.name.getText();
                    return name === 'Mathf' || name === 'Math';
                }))
                .map(s => this.visit(s))
                .join('\n');
        }

        if (ts.isClassDeclaration(node)) {
            const className = node.name?.text || 'UnnamedClass';
            const heritage = node.heritageClauses?.map(h => this.visit(h)).join(', ') || 'UdonSharpBehaviour';
            
            let result = `using UdonSharp;\nusing UnityEngine;\nusing VRC.SDKBase;\nusing VRC.Udon;\n\n`;
            result += `public class ${className} : ${heritage}\n{\n`;
            this.indentLevel++;
            result += node.members.map(m => this.getIndent() + this.visit(m)).join('\n');
            this.indentLevel--;
            result += `\n}\n`;
            return result;
        }

        if (ts.isHeritageClause(node)) {
            return node.types.map(t => this.visit(t)).join(', ');
        }

        if (ts.isExpressionWithTypeArguments(node)) {
            return this.visit(node.expression);
        }

        if (ts.isIdentifier(node)) {
            return node.text;
        }

        if (ts.isPropertyDeclaration(node)) {
            let modifiers = node.modifiers?.filter(m => !ts.isDecorator(m)).map(m => this.visit(m)).join(' ') || 'public';
            const decorators = node.modifiers?.filter(m => ts.isDecorator(m)).map(m => this.visit(m)).join('\n' + this.getIndent()) || '';
            let name = this.visit(node.name);

            // Capitalize all property declarations (public, private, protected, nullable, etc.)
            name = this.capitalize(name);

            let typeStr = 'object';
            if (node.type) {
                typeStr = this.mapType(node.type);
                // If the property has a question mark (e.g., prop?: type), it's nullable
                if (node.questionToken && !typeStr.endsWith('?')) {
                    typeStr += '?';
                }
            }

            const initializer = node.initializer ? ` = ${this.visit(node.initializer)}` : '';
            
            let result = '';
            if (decorators) result += decorators + '\n' + this.getIndent();
            result += `${modifiers} ${typeStr} ${name}${initializer};`;
            return result;
        }

        if (ts.isDecorator(node)) {
            let expression = this.visit(node.expression);
            // UdonSynced() -> UdonSynced
            if (expression.endsWith('()')) {
                expression = expression.slice(0, -2);
            }
            return `[${expression}]`;
        }

        if (ts.isMethodDeclaration(node)) {
            const modifiers = node.modifiers?.map(m => this.visit(m)).join(' ') || 'public';
            const name = this.visit(node.name);
            const type = node.type ? this.mapType(node.type) : 'void';
            const params = node.parameters.map(p => this.visit(p)).join(', ');
            const body = node.body ? this.visit(node.body) : ';';

            const udonEventMap: Record<string, string> = {
                'start': 'Start',
                'update': 'Update',
                'lateUpdate': 'LateUpdate',
                'fixedUpdate': 'FixedUpdate',
                'onEnable': 'OnEnable',
                'onDisable': 'OnDisable',
                'onDestroy': 'OnDestroy',
                'interact': 'Interact',
                'interaction': 'Interaction',
                'onPickup': 'OnPickup',
                'onDrop': 'OnDrop',
                'onPickupUseDown': 'OnPickupUseDown',
                'onPickupUseUp': 'OnPickupUseUp',
                'onPlayerJoined': 'OnPlayerJoined',
                'onPlayerLeft': 'OnPlayerLeft',
                'onStationEntered': 'OnStationEntered',
                'onStationExited': 'OnStationExited',
                'onOwnershipTransferred': 'OnOwnershipTransferred',
                'onPreSerialization': 'OnPreSerialization',
                'onPostSerialization': 'OnPostSerialization',
                'onDeserialization': 'OnDeserialization',
                'onTriggerEnter': 'OnTriggerEnter',
                'onTriggerExit': 'OnTriggerExit',
                'onTriggerStay': 'OnTriggerStay',
                'onCollisionEnter': 'OnCollisionEnter',
                'onCollisionExit': 'OnCollisionExit',
                'onCollisionStay': 'OnCollisionStay',
                'onVideoStart': 'OnVideoStart',
                'onVideoEnd': 'OnVideoEnd',
                'onVideoPlay': 'OnVideoPlay',
                'onVideoPause': 'OnVideoPause',
                'onVideoError': 'OnVideoError'
            };
            
            const mappedName = udonEventMap[name] || this.capitalize(name);
            const needsOverride = name in udonEventMap || Object.values(udonEventMap).includes(mappedName);
            const overrideStr = (needsOverride && (modifiers.includes('public') || modifiers.includes('protected'))) ? ' override' : '';
            
            let result = `\n${this.getIndent()}${modifiers}${overrideStr} ${type} ${mappedName}(${params})\n`;
            result += `${this.getIndent()}${body}\n`;
            return result;
        }

        if (ts.isParameter(node)) {
            const type = node.type ? this.mapType(node.type) : 'object';
            const name = this.visit(node.name);
            return `${type} ${name}`;
        }

        if (ts.isVariableStatement(node)) {
            return node.declarationList.declarations.map(d => this.visit(d)).join('\n') + ';';
        }

        if (ts.isVariableDeclaration(node)) {
            const name = this.visit(node.name);
            let typeStr = 'var';
            if (node.type) {
                typeStr = this.mapType(node.type);
            }
            const initializer = node.initializer ? ` = ${this.visit(node.initializer)}` : '';
            return `${typeStr} ${name}${initializer}`;
        }

        if (ts.isBlock(node)) {
            let result = `{\n`;
            this.indentLevel++;
            result += node.statements.map(s => this.getIndent() + this.visit(s)).join('\n');
            this.indentLevel--;
            result += `\n${this.getIndent()}}`;
            return result;
        }

        if (ts.isExpressionStatement(node)) {
            return this.visit(node.expression) + ';';
        }

        if (ts.isCallExpression(node)) {
            let expression = this.visit(node.expression);
            const args = node.arguments.map(a => this.visit(a)).join(', ');

            const typeArgs = (node.typeArguments && node.typeArguments.length > 0)
                ? `<${node.typeArguments.map(t => this.mapType(t)).join(', ')}>`
                : '';
            
            if (expression === 'DebugLog') {
                return `Debug.Log(${args})`;
            }

            // Capitalize method calls on 'this'
            if (ts.isPropertyAccessExpression(node.expression) && this.visit(node.expression.expression) === 'this') {
                const propName = this.visit(node.expression.name);
                const udonEventMap: Record<string, string> = {
                    'start': 'Start', 'update': 'Update', 'lateUpdate': 'LateUpdate', 'fixedUpdate': 'FixedUpdate',
                    'onEnable': 'OnEnable', 'onDisable': 'OnDisable', 'onDestroy': 'OnDestroy',
                    'interact': 'Interact', 'interaction': 'Interaction', 'onPickup': 'OnPickup', 'onDrop': 'OnDrop',
                    'onPickupUseDown': 'OnPickupUseDown', 'onPickupUseUp': 'OnPickupUseUp',
                    'onPlayerJoined': 'OnPlayerJoined', 'onPlayerLeft': 'OnPlayerLeft',
                    'onStationEntered': 'OnStationEntered', 'onStationExited': 'OnStationExited',
                    'onOwnershipTransferred': 'OnOwnershipTransferred', 'onPreSerialization': 'OnPreSerialization',
                    'onPostSerialization': 'OnPostSerialization', 'onDeserialization': 'OnDeserialization'
                };
                const mappedName = udonEventMap[propName] || this.capitalize(propName);
                expression = `this.${mappedName}`;
            } else if (ts.isIdentifier(node.expression)) {
                // For standalone calls, they might be class methods if they're not global functions
                // In UdonSharp, you typically call class methods via 'this.Method()' or just 'Method()'
                // Let's capitalize them too if they're not known global functions.
                const globalFuncs = ['DebugLog', 'Vector3', 'Quaternion', 'Color', 'LayerMask'];
                if (!globalFuncs.includes(expression)) {
                    expression = this.capitalize(expression);
                }
            }
            
            const operator = node.questionDotToken ? '?.' : '';
            return `${expression}${operator}${typeArgs}(${args})`;
        }

        if (ts.isPropertyAccessExpression(node)) {
            let obj = this.visit(node.expression);
            let prop = this.visit(node.name);
            
            // Map Math.* to Mathf.* and capitalize member
            if (obj === 'Math') {
                obj = 'Mathf';
                prop = this.capitalize(prop);
            }

            // Capitalize ALL property/method names (including library types),
            // except ones starting with an underscore (likely private/internal)
            if (!prop.startsWith('_')) {
                const udonEventMap: Record<string, string> = {
                    'start': 'Start', 'update': 'Update', 'lateUpdate': 'LateUpdate', 'fixedUpdate': 'FixedUpdate',
                    'onEnable': 'OnEnable', 'onDisable': 'OnDisable', 'onDestroy': 'OnDestroy',
                    'interact': 'Interact', 'interaction': 'Interaction', 'onPickup': 'OnPickup', 'onDrop': 'OnDrop',
                    'onPickupUseDown': 'OnPickupUseDown', 'onPickupUseUp': 'OnPickupUseUp',
                    'onPlayerJoined': 'OnPlayerJoined', 'onPlayerLeft': 'OnPlayerLeft',
                    'onStationEntered': 'OnStationEntered', 'onStationExited': 'OnStationExited',
                    'onOwnershipTransferred': 'OnOwnershipTransferred', 'onPreSerialization': 'OnPreSerialization',
                    'onPostSerialization': 'OnPostSerialization', 'onDeserialization': 'OnDeserialization'
                };
                prop = udonEventMap[prop] || this.capitalize(prop);
            }
            
            const operator = node.questionDotToken ? '?.' : '.';
            return `${obj}${operator}${prop}`;
        }

        if (ts.isStringLiteral(node)) {
            return `"${node.text}"`;
        }

        if (ts.isNumericLiteral(node)) {
            return node.text;
        }

        if (ts.isModifier(node)) {
            switch (node.kind) {
                case ts.SyntaxKind.PublicKeyword: return 'public';
                case ts.SyntaxKind.PrivateKeyword: return 'private';
                case ts.SyntaxKind.ProtectedKeyword: return 'protected';
                case ts.SyntaxKind.StaticKeyword: return 'static';
                default: return '';
            }
        }

        if (ts.isBinaryExpression(node)) {
            const left = this.visit(node.left);
            let operator = node.operatorToken.getText(this.sourceFile);
            const right = this.visit(node.right);
            
            if (operator === '??') {
                return `${left} ?? ${right}`;
            }
            
            return `${left} ${operator} ${right}`;
        }

        if (ts.isPostfixUnaryExpression(node)) {
            const operand = this.visit(node.operand);
            const operator = ts.tokenToString(node.operator);
            return `${operand}${operator}`;
        }

        if (ts.isPrefixUnaryExpression(node)) {
            const operand = this.visit(node.operand);
            const operator = ts.tokenToString(node.operator);
            return `${operator}${operand}`;
        }

        if (node.kind === ts.SyntaxKind.ThisKeyword) {
            return "this";
        }

        if (ts.isNewExpression(node)) {
            const expression = this.visit(node.expression);
            const args = node.arguments ? node.arguments.map(a => this.visit(a)).join(', ') : '';
            return `new ${expression}(${args})`;
        }

        if (ts.isIfStatement(node)) {
            const expression = this.visit(node.expression);
            const thenStatement = this.visit(node.thenStatement);
            const elseStatement = node.elseStatement ? ` else ${this.visit(node.elseStatement)}` : '';
            return `if (${expression}) ${thenStatement}${elseStatement}`;
        }

        if (ts.isReturnStatement(node)) {
            const expression = node.expression ? ` ${this.visit(node.expression)}` : '';
            return `return${expression};`;
        }

        if (node.kind === ts.SyntaxKind.NullKeyword) {
            return "null";
        }

        if (ts.isTypeAliasDeclaration(node) || ts.isInterfaceDeclaration(node)) {
            return "";
        }

        return `/* Unknown node: ${ts.SyntaxKind[node.kind]} */`;
    }

    private mapType(type: ts.TypeNode): string {
        if (ts.isUnionTypeNode(type)) {
            const types = type.types.map(t => t.getText().trim());
            const isNullable = types.some(text => text === 'null' || text === 'undefined');
            const effectiveTypes = type.types.filter(t => {
                const text = t.getText().trim();
                return text !== 'null' && text !== 'undefined';
            });

            if (effectiveTypes.length > 0) {
                const baseType = this.mapType(effectiveTypes[0]);
                if (isNullable && !baseType.endsWith('?')) {
                    return baseType + '?';
                }
                return baseType;
            }
        }

        const typeText = type.getText().trim();
        if (typeText.endsWith('?')) {
            const baseTypeNode = (type as any).elementType || (type as any).type;
            if (baseTypeNode) {
                 const baseType = this.mapType(baseTypeNode);
                 if (!baseType.endsWith('?')) return baseType + '?';
                 return baseType;
            }
            // Fallback if structure is unknown
            return typeText;
        }

        switch (typeText) {
            case 'string': return 'string';
            case 'number': return 'float';
            case 'boolean': return 'bool';
            case 'void': return 'void';
            case 'any': return 'object';
            case 'Vector2': return 'Vector2';
            case 'Vector3': return 'Vector3';
            case 'Vector4': return 'Vector4';
            case 'Quaternion': return 'Quaternion';
            default: return typeText;
        }
    }

    private capitalize(s: string): string {
        if (s.length === 0) return s;
        // Don't capitalize if it seems to be a local variable or already capitalized
        if (s === 'this') return s;
        if (s.startsWith('_')) return s;
        return s.charAt(0).toUpperCase() + s.slice(1);
    }

    private getIndent(): string {
        return '    '.repeat(this.indentLevel);
    }
}
