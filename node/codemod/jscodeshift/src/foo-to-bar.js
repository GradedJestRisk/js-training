module.exports = function(fileInfo, api) {
   return api.jscodeshift(fileInfo.source)
      .findVariableDeclarators('foo')
      .renameTo('bar')
      .toSource();
};
