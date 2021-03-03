<template>
  <div id="root" class="root">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
  	mounted(){
  		// const now = new Date().getTime();
  		// const leaveTime = parseInt(localStorage.getItem('leaveTime'), 10);
  		// alert(leaveTime)
  		// const refresh = (now - leaveTime) <= 5000;
  		// if(!refresh){
  		//  	localStorage.removeItem('token');
  		// }
  		// window.onbeforeunload = function (e) {
    //         localStorage.setItem('leaveTime',new Date().getTime())
    //     }
  		// window.addEventListener('beforeunload',()=>{
  		//  	localStorage.setItem('leaveTime',new Date().getTime())





    //         // localStorage.removeItem('token');
    //     });

  		// const now = new Date().getTime();
  		// const leaveTime = parseInt(localStorage.getItem('leaveTime'), 10);

  	}
  }
</script>

<style lang="scss" scoped>
  .root{
    width: 100%;
    height: 100%;
  }
</style>
