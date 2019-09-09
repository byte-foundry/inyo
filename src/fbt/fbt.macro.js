const {createMacro} = require('babel-plugin-macros');
const babelPluginFbt = require('babel-plugin-fbt');
const babelPluginFbtRuntime = require('babel-plugin-fbt-runtime');
const {addDefault} = require('@babel/helper-module-imports');

module.exports = createMacro(fbt);

function fbt({references, state, babel}) {
	const {default: defaultImport = []} = references;
	const instanceBPF = babelPluginFbt(babel);
	const instanceBPFRuntime = babelPluginFbtRuntime(babel);

	const importName = addDefault(state.file.path, 'fbt', {
		ensureNoContext: true,
		nameHint: 'fbt',
	});

	Object.assign(instanceBPF, state);
	Object.assign(instanceBPFRuntime, state);

	instanceBPF.pre();
	instanceBPFRuntime.pre();

	state.file.path.traverse(instanceBPF.visitor, state);
	state.file.path.traverse(instanceBPFRuntime.visitor, state);

	state.file.path.traverse(
		{
			CallExpression(path) {
				if (
					path.node.callee.type === 'MemberExpression'
					&& path.node.callee.object
					&& path.node.callee.object.name === 'fbt'
				) {
					path.node.callee.object.name = this.importName.name;
				}
			},
		},
		{importName},
	);
}
