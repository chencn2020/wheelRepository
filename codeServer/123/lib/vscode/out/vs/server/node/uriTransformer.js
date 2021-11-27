module.exports=e=>({transformIncoming:e=>{switch(e.scheme){case"vscode-remote":return{scheme:"file",path:e.path};default:return e}},transformOutgoing:t=>{switch(t.scheme){case"file":return{scheme:"vscode-remote",authority:e,path:t.path};default:return t}},transformOutgoingScheme:e=>{switch(e){case"file":return"vscode-remote";default:return e}}});
//# sourceMappingURL=uriTransformer.js.map
