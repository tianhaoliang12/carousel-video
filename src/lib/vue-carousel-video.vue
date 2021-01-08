<template>
  <div class="vcv-carousel" v-show="visible">
    <div id="parent">
      <ul tag="ul" class="vcv-carousel__slide" >
        <li v-for="(item,index) in slideData" :key="index" v-show="index==beginValue" >
          <img v-if="item.type === 'img'" :style="imgStyle" ref="img" class="vcv-carousel__img" :src="item.src" v-drag />
          <video v-else controls="true" autoplay="autoplay" name="media"><source :src="item.src" type="video/mp4"></video>
        </li>
      </ul>
      <div class="vcv-carousel__up" @click="up"><img src="http://storage.jd.local/electron/carousel_left.png" alt=""></div>
      <div class="vcv-carousel__next" @click="next"><img src="http://storage.jd.local/electron/carousel_right.png" alt=""></div>
      <div class="vcv-carousel__close" @click="close"><img src="http://storage.jd.local/electron/carousel_close.png" alt=""></div>
    </div>
    
    <div class="vcv-carousel__tool_box">
      <div v-show="toolSwitch" @click="enlarge" class="vcv-carousel__tool1"><img src="http://storage.jd.local/electron/carousel_icon1.png" alt=""></div>
      <div v-show="toolSwitch" @click="narrow" class="vcv-carousel__tool2"><img src="http://storage.jd.local/electron/carousel_icon2.png" alt=""></div>
      <span>{{beginValue+1}}/{{slideData.length}}</span>
      <div v-show="toolSwitch" @click="leftRotate" class="vcv-carousel__tool3"><img src="http://storage.jd.local/electron/carousel_icon3.png" alt=""></div>
      <div v-show="toolSwitch" @click="rightRotate" class="vcv-carousel__tool4"><img src="http://storage.jd.local/electron/carousel_icon4.png" alt=""></div>
    </div>
  </div>
</template>
 
<script>
  export default {
    name: "carousel",
    data(){
      return{
        beginValue:0,
        imgStyle: {
          transform:'scale(1) rotate(0deg)',
          transition: 'transform 0.3s ease 0s'
        },
        scale: 1,
        rotate: 0,
      }
    },
    computed: {
      toolSwitch() {
        if (this.slideData[this.beginValue].type === 'img') {
          return true
        } else {
          return false
        }
      }
    },
    methods:{    
      initImgStyle() {
        this.imgStyle = {
          transition: 'transform 0.3s ease 0s',
          transform:`scale(${this.scale}) rotate(${this.rotate}deg)`
        }
      },
      leftRotate() {
        this.rotate -= 90
        this.initImgStyle()
      },
      rightRotate() {
        this.rotate += 90
        this.initImgStyle()
      },
      enlarge() {
        this.scale += 0.2
        this.initImgStyle()
      },
      narrow() {
        this.scale -= 0.2
        if (this.scale < 0.1) {
          this.scale = 0.1
          return false
        }
        this.initImgStyle()
      },
      change(key){
        if(key>(this.slideData.length-1)){
          key=0;
        }
        if(key<0){
          key=this.slideData.length-1;
        }
        this.beginValue=key;

        this.scale = 1;
        this.rotate = 0;
        this.initImgStyle();
        this.$refs.img.forEach(item => {
          item.style.marginTop = ''
          item.style.marginLeft = ''
        })
      },
      up(){      
        --this.beginValue;
        this.change(this.beginValue);
      },
      next(){
        ++this.beginValue;
        this.change(this.beginValue);
      },
      close() {
        this.$emit('close')
      },
    },
    mounted(){
      this.beginValue = this.begin;
    },
    props:{
      visible: {
        type: Boolean,
        default: false
      },
      begin:{
        type: Number,
        default: 0
      },
      slideData:{
        type: Array,
        default: function () {
          return [];
        }
      }
    },
    watch: {
      visible(val) {
        if (val) {
          document.body.style.overflow = 'hidden'
        } else {
          document.body.style.overflow = '' // 出现滚动条
        }
      }
    },
    directives: {
      drag (el) {
        const oDiv = el
        // 拖拽时间标识
        let firstTime = ''
        let lastTime = ''
        document.onselectstart = function () {
          return false
        }
        oDiv.onmousedown = function (e) {
        // 为了区分点击还是拖拽，使用时间差来判断，200毫秒内为点击，200毫秒外为拖拽，初始化为点击
          document.getElementById('parent').setAttribute('drag-flag', false)
          firstTime = new Date().getTime()
          
          const marginLeft = oDiv.style.marginLeft===''?0:parseInt(oDiv.style.marginLeft)
          const marginTop = oDiv.style.marginTop===''?0:parseInt(oDiv.style.marginTop)
          const downX = e.clientX - marginLeft
          const downY = e.clientY - marginTop

          document.onmousemove = function (e) {
            // 实时计算左滑间距
            const r = e.clientX - downX
            oDiv.style.marginLeft = r + 'px'
            // 实时计算上滑间距
            const t = e.clientY - downY
            oDiv.style.marginTop = t + 'px'

            // 判断下当前时间与初始时间差，大于200毫秒则判断状态为拖拽
            lastTime = new Date().getTime()
            if (lastTime - firstTime > 200) {
              document.getElementById('parent').setAttribute('drag-flag', true)
            }
          }
          // 鼠标抬起时清除事件
          document.onmouseup = function (e) {
            document.onmousemove = null
            document.onmouseup = null
          }
          return false
        }
      }
    }
  }
</script>
 
<style>
  .vcv-carousel{ position: fixed; z-index: 88888; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,.65);}
  
  .vcv-carousel  .vcv-carousel__slide{position: absolute; margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; display: flex; align-items: center; justify-content: center;}
  .vcv-carousel  .vcv-carousel__slide li{list-style: none;position: absolute; left: 0; top: 0; width: 100%; height:100%; display: flex; justify-content: center; align-items: center; overflow: hidden;} 
  .vcv-carousel  .vcv-carousel__slide li img{transform: scale(1) rotate(0deg); margin-left: 1px; margin-top: 1px; max-width: 100%; max-height: 100%;}
  .vcv-carousel  .vcv-carousel__slide li video{ position: relative; margin: 0 auto; width: 80%; height: auto;}

  .vcv-carousel  .vcv-carousel__up,.vcv-carousel__next{position: absolute; left:0; top: 50%; margin-top: -32px; cursor: pointer;  width:44px; height: 44px; border-radius: 50%; }
  .vcv-carousel  .vcv-carousel__up{ left: 40px;}
  .vcv-carousel  .vcv-carousel__next{ left: auto; right:40px;}
  .vcv-carousel  .vcv-carousel__close{ position: absolute; top: 40px; right: 48px; width: 32px; height: 32px; cursor: pointer; border-radius: 50%;}
  .vcv-carousel  .vcv-carousel__up:hover{background-color: rgba(0,0,0,.3)}
  .vcv-carousel  .vcv-carousel__next:hover{background-color: rgba(0,0,0,.3)}
  .vcv-carousel  .vcv-carousel__close:hover{background-color: rgba(0,0,0,.3)}

  .vcv-carousel  .vcv-carousel__tool_box{ position: absolute; z-index: 99999; display: flex; justify-content: space-around; align-items: center; left: 50%; bottom: 30px; margin-left: -141px; width: 282px; height: 44px; border-radius: 22px; background: rgba(0,0,0,0.45);}
  .vcv-carousel  .vcv-carousel__tool_box div{ width: 21px; height: 21px; cursor: pointer;}
  .vcv-carousel  .vcv-carousel__tool_box span{ font-size: 14px; color: #fff;}
</style>