import{parser as e}from"@lezer/yaml";import{delimitedIndent as n,indentNodeProp as o,foldInside as r,foldNodeProp as t,LRLanguage as l,LanguageSupport as a}from"@codemirror/language";const i=l.define({name:"yaml",parser:e.configure({props:[o.add({Stream:e=>{for(let n=e.node.resolve(e.pos,-1);n&&n.to>=e.pos;n=n.parent){if(n.name=="BlockLiteralContent"&&n.from<n.to)return e.baseIndentFor(n);if(n.name=="BlockLiteral")return e.baseIndentFor(n)+e.unit;if(n.name=="BlockSequence"||n.name=="BlockMapping")return e.column(n.from,1);if(n.name=="QuotedLiteral")return null;if(n.name=="Literal"){let o=e.column(n.from,1);if(o==e.lineIndent(n.from,1))return o;if(n.to>e.pos)return null}}return null},FlowMapping:n({closing:"}"}),FlowSequence:n({closing:"]"})}),t.add({"FlowMapping FlowSequence":r,"BlockSequence BlockMapping BlockLiteral":(e,n)=>({from:n.doc.lineAt(e.from).to,to:e.to})})]}),languageData:{commentTokens:{line:"#"},indentOnInput:/^\s*[\]\}]$/}});function yaml(){return new a(i)}export{yaml,i as yamlLanguage};
