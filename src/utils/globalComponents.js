import promptMessage from 'src/components/riskAssess/PromptMessage'
function plugin(Vue){
	if(plugin.installed){
		return;
	}
	Vue.component('glPromptMessage',promptMessage)
}
export default plugin;
