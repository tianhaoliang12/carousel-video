<template>
  <div id="carousel" v-show="visible">
    <div id="parent">
      <ul tag="ul" class="slide" >
        <li v-for="(item,index) in slideData" :key="index" v-show="index==beginValue" >
          <img v-if="item.type === 'img'" :style="imgStyle" ref="img" class="img" :src="item.src" v-drag />
          <video v-else controls="true" autoplay="autoplay" name="media"><source :src="item.src" type="video/mp4"></video>
        </li>
      </ul>
      <div class="up" @click="up"></div>
      <div class="next" @click="next"></div>
      <div class="close" @click="close"></div>
    </div>
    
    <div class="tool_box">
      <div v-show="toolSwitch" @click="enlarge" class="tool1"></div>
      <div v-show="toolSwitch" @click="narrow" class="tool2"></div>
      <span>{{beginValue+1}}/{{slideData.length}}</span>
      <div v-show="toolSwitch" @click="leftRotate" class="tool3"></div>
      <div v-show="toolSwitch" @click="rightRotate" class="tool4"></div>
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
  #carousel{ position: fixed; z-index: 88888; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,.65);}
  
  .slide{position: absolute; margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; display: flex; align-items: center; justify-content: center;}
  .slide li{list-style: none;position: absolute; left: 0; top: 0; width: 100%; height:100%; display: flex; justify-content: center; align-items: center; overflow: hidden;} 
  .slide li img{transform: scale(1) rotate(0deg); margin-left: 1px; margin-top: 1px; max-width: 100%; max-height: 100%;}
  .slide li video{ position: relative; margin: 0 auto; width: 80%; height: auto;}

  .up,.next{position: absolute; left:0; top: 50%; margin-top: -32px; cursor: pointer;  width:44px; height: 44px; border-radius: 50%; }
  .up{ left: 40px; background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFgAAABYCAYAAABxlTA0AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAP8A/wD/oL2nkwAAA0NJREFUeNrtnb9uGkEQxg8fUNoWziPgglhCoojkINHQ0FihxBaSXYApTBN0fgwQLxHnWSDwTsnsaS4hGDB/bofZ5fukrzCyYe8nfLc7OzMbBHqUIRfIRfIXcoPcIj+Su+QX8nf2C7/2yL/T4L8p8ntkAijWFblC/kbuk6OU3Of3rPBnnJQuyV/5GxgJucufeekrVPMvWyLfC0Jd53seixe3kZBcJncUgF12h8cWugr3M7mnEOyyezxWZ/SJn+yRY27x2NXqjFwjDxyEm3jA13CmDe45ue0w2GW3+ZpU6DrlOawW9/najqpbD8Eu+/ZY89r6CcBNXJecN5sHwN0JwU18J/Hwy5wo3EXIVr/J9ROGu3i7wAPNtQffNaC+c2pTuAtP57lpzJMv0pgxtAFz44rvoJlFDRA/dO2QqNgAALcKEO0VhWsB3k6hzp10A2g7+2aXbZ4egO21M7LV9lMZsPZ2eZtYQwegDtpI3RirKAHSwS5tAvzg2gXlcrnX8Xj8NhwOf4RhqGFMD5sybpyD+4v0m2UgKxnbygyiqstwjeib/FPJ+KqrAHddhmt+Nq8rGWN31bLYZbizfD7/qmys/y2fK4CbuiuLgJuAm7qbi4uLvmtwZyTFcJOAfLzoKACuNRu2cV2DWrjT6dRVuBGzjYtHVMKdTCYuw42YbVyhA7h23FC3c+ER3L87HU/K4E49gRsx2+BZK9z5fO4y3IjZxlWTRx1INpuNPIQbMdu4NPWoAxmNRm8ewo2YrUrAc58Aa71FzH25RXTxkLMbF1Y9TXMc8pPWhYYvkFual8pTX5bKCPZYDvaoDlc6DrnoRMDdYcgFbBkJbBk5u+mpHHIT2/aC2/ZIPLGceOJD6tRMc+oUkv8Ekv+Qvmo5fRUJ2JYTsFFCIFBCgCIYy0UwKOOyXMaFQkSBQkSU0loupU2EYnCLxeDJ8hntDCy2MzBCQw6LDTmM0FLGcksZo/MATZHWBdRT69CKtl7vnXpnVjSm+2drHVnRWtFia8UkVoHmoJaF9rYCQoNmIaHFuIDQJF9AOOZBQDioREg4akdIOCxKQGGA487E5s04sE9IJuvFpBZJHzlZDTw+cnKdrgIcmip6G/Hu2N8/+2eo+FuARqUAAAAASUVORK5CYII="); background-size: 100% 100%;}
  .next{ left: auto; right:40px; background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFgAAABYCAYAAABxlTA0AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAP8A/wD/oL2nkwAAA0tJREFUeNrtnc9OIkEQxgcHOKrBfQQ8sCYkHDZxSbhw4WLWIxoSPcBygItk9jEgvMS6zwIL7+RWT3oiIrD8mWqqmu9LvotR6PllnOmurqoOAjnKkAvkIvkbuUFukp/IHXKP/GLdsz97sr/TsH9TtJ+RCaBYV+QK+Qe5T45Sct9+ZsV+x0npkvzd3oGRI3fsd176CtX8y5bIDw6hrvODHYsXj5GQXCa3BYBddtuOLdQK9yu5KxDssrt2rGr0xb7ZI2Vu2rGL1Rm5Rh4ohJt4YK/hTBrcc3JLMdhlt+w1idB1ynNYKe7bazuqbj0Eu+zbY81r6ycAN3Hd5bzZvADuTghu4jsXL7/MicJdhMx6J9dPGO7i4wIvNG0vvmtA/eTUpnAXns5z05gnX6QxY2gB5sYV30Ezixog/te1Q6JiAwDcKkC0VxSuCXg7hTp30g2g7eybXbZ5ugC2187IVttPZcDa2+VtYg1tgDpoI3VjrKIESAe7tAnw47EHGIZhNBwOf4/H49dcLvdLIeDHTRk3Rx+ggftm9ZekFPLKDKKqhMHRnfvnbUFKIVdXAe5IGJyBaaAqh9xZtSwWM8B8Pm8gz5RD/rB8rkgboAeQK4uA7yUOUjnk+8XFhdiAuoE8IymE3E8WHQXpd4NiyIZtXNcQaYQ8nU6lQzZs4+KRSCvkyWQiGbJhG1foRIDM4obKnYs1kKcCIcc7Hc8ao1ZKIBu2wU+toUEDeT6fS4Zs2MZVk5FvkLPZrITxGbZxaWrkG+TRaPQqYGwvPgGeSwXc8w2utEdEBy853rjwM+DyTtOagMu70GhggcG7VEawhznYUwRc3nBlAXB5A+7YMmLeMhK96akU7odNT2zbO9i2R+IJc+KJtNSpmW+pU0j+c5D8h/RV5vRVJGAzJ2CjhMBBCQGKYJiLYFDGxVzGhUJEB4WIKKVlLqVNhGJwxmLwZPmMdgaM7QyM0JCDsSGHEVrKMLeUMToP0BRpXUA9tQ6taOv12al3ZkVjunezdWRFa0XG1opJrALNQZmF9rYOhAbNjoQW4w6EJvkOhGMeHAgHlTgSjtpxJBwW5UBhgOPOnM2bcWCfI5msF5Na5PrIyWrg8ZGT63QV4NBUp48R7479/Qf3Z6j3TNyHSgAAAABJRU5ErkJggg=="); background-size: 100% 100%;}
  .close{ position: absolute; top: 40px; right: 48px; width: 32px; height: 32px; cursor: pointer; border-radius: 50%; background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAP8A/wD/oL2nkwAABIZJREFUeNrtWztPG0EQthVRRIoU2kTQkQ4k/gAILB5KilBZpIBQ4golShORpMM0pqAwSAilQbIwhUGcI0HslNTQQIFAvGkokPgFZL7oDt1Ndo+z73bvjO+kkaz17cx8c7uzM7O7iYTi5/b29uXZ2VnPxcXF2OXl5Vf6vUhUOD8/XyfaMmkdbfgP7+Bd9EHfRCM+V1dXbwjIJIFYJnBVoj91UhU8wAs8Iw367u7uOSmcJvrpA/BjBN5pyIoM8Jubmxek1DjRhkLgnCBrHLJDA35/f4+hPkSKlNyUpSFc2d3dXTEMYyafz3+ampr6ODAwMNLV1fW2tbU1BcJvtOE/vIN30Qd9HzFECTpAF60POalXJHzeBfTvnZ2dhdnZ2UxHR8cwdemrh9AXPMALPF0MMQ+dtIC/vr7uIYGbIkWOjo7Kq6ur3/FF6wUtI/AEb8iQGGETuqkc8kkSkhEJPzk52SoUCt/a29sHgwbOCTIgCzIlhshA16DBP6MhOC0SSMNzsb+//71q4JwgE7IlU3AaOgcGnuZXlgs5PT3dXlpa+pJMJvt0g7cIsqEDdOH6QWffRsBQEn35w8PDjYmJidGwgHMiXT5AJ8lIqH86iOb8/v7+WiqVGokKeIugE3QT+QQ/3t7B7ODgYK27u/td1MBbBN2gI9e75tWB5s9rvtRhiEXxy4tGgmA6bAKT5wiPBzlwMlGa8x58wqjAMc57ihgptBzmQwietlHAWwSdOQ5g85LYlPg6H+ZS52eJFMQJJdcEyszqHBFeGEFOkMGSIGIcd8vnHc4DIWejgrcIGHgqLawnmMUMe2JjtLW1DTa6AYABWJgR0iIDOCo5yLwaHbxFwMIrS//V8Hg+ryKlDYuAhdcTHDVGChImmedf8Cu0WCz+OD4+/lUul7MtLS0190cf9AUP8PKrDzCxZGnSPvyX7X9ms9mMX4FQ3OJXqVTmajEC3kUfqz94+dUHmNg0WH6o29tL16jD+SljWWQYhiOF9moEvFOtVufsfcHLrz7AxGqM1X/7DtTYaxe2t7e3EsS841/RixFE4GsdPW4EbMzX9WL+jzFrzwTlfGoxgmrw5qicYX5gLIGtKHtjPp//HKQH9mIEHeBBwGaXAexwgI54GbX5oJchNyPoAg8CNuYIFxPmRuVDIzYoVKzFMiPoAg8CNuYDCglzl/ahsbOzU1kAJDKCLvAgYGMy12EAR+EAW1UqozKZEagtpxI8CNiY3O1QDMCHvY6v72YArVNABD7UKaDTCQocXq7WYEmFE9SyDIrAW8ugLiMIl8GQAqEcD4R0GEEYCIUQCudkobBqIwhD4aglQyqNIEyGopgOcyMoTYebviASl8TiomhcFn/SGyM4VCU4WZaOt8bizdF4e1x6QGLoCR+QGIqPyMSHpOJjcvFBSc9PAx2VHVVyVNY0QvMelrYboWmPy9unw2MXJnTkDpCh/cKEYHWQXZkxNFyZMUK5MsPihOa9NGWPGM1zxWFfmxvWfm1OkEA138VJST2h+a7OSjLK5rs8LXv49Xnsx8muz+M/3dfn/wKrGc8uJ5UoPAAAAABJRU5ErkJggg=="); background-size: 100% 100%;}
  .up:hover{background-color: rgba(0,0,0,.3)}
  .next:hover{background-color: rgba(0,0,0,.3)}
  .close:hover{background-color: rgba(0,0,0,.3)}

  .tool_box{ position: absolute; z-index: 99999; display: flex; justify-content: space-around; align-items: center; left: 50%; bottom: 30px; margin-left: -141px; width: 282px; height: 44px; border-radius: 22px; background: rgba(0,0,0,0.45);}
  .tool_box div{ width: 21px; height: 21px; cursor: pointer;}
  .tool_box div.tool1{ background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAP8A/wD/oL2nkwAAA+dJREFUeNrtXM9LG0EUThNMc6gQCBQECbb/gfRiIN5CcwiFXq1CbcFDCxoKbbx48pDGq0cb8CQ55GKxBC2FQCBgpad6KhbsxRx6jIeUgt2+wVcSpm+2bpzZmUnnwUdQd7/39su8+fFm1kjEmTNnzkbcPM8bB0wDcoBFQBFQAqzhZxF/n8Prxv8XUZYBu4CeF8x6eN/yyIkFD5QAzANOPDl2gnwJm0WJAjKALcC5p8bOkZ/5idokThrw2QvXmL+0DeLEAYdXeKCfgANAGVAATAFSeH8Kfy7g3w/w+n8Z8xs3VZgkYANw5vMALRyh8uz6IfjzeH/Lx8cZxpE0TaCaT9BNQFayvyzyiqxmkjhLgF+CQLcV+94W+GXxLJmQVjWBOG3AAiCmOIYY+mkLRKppSzfMdcrqmuKpC+LZ0DVaUR3yd8CkJoEm0T/VccfDDCQtGMrrusThRKoLpgDpMAKICiaBbcNG1bZgMhlV7TgjyPMFwwRaEMSZUe34DTWUqx6thhzdqCnAlupVOb/wbErs9CuADn7GJfE2iQVuIsxmm5XEXeF4KxJn3LzNqyp28fWclkT+LsfdlcjdIupJ47IFWiG+iZJE/r9MIneJoF+WLdBbwkneEoHyBP2u7PTqEfWcpCUCJYl6Uk9amuGuAm8HkluoMoGQ/z3hYloWeY4gL1smUJlwkZNFvkiQFywTqEC4WJRFXiTIp4aYBHYlFei7QSeTWOPmrahymExdYxIoyyoBYkgpm6bgdjBvQb69jiKBOgGXSbytuRbUj+Eucf+q64P6McwQPC/cKNbnf6RyFBuFedBrwsV9N5Pu8x8RLu65tdgl9wSxd/cDcMut5i+5HxD0+64e1Od+RdA/cxXFPvcnjvtUanoNOJq3sCb9kIh5LqLCLN3V+EjsaoxFVBmeCbRhX+wmYIeItarasS07q08Fcc6odmzL3vwHIsbjUFq64ac7WIF+E3DBxbYHuB1mICaeD2LifCFi+gq4oSMg006YbQriWdfZnHWfUWSj1RPscy5EB0m1jrKaT7nuXLHI1mBi6hQptHPSbJmGM+TDgJXIhraWFMJJ+wlclb8k1lZ8h7zuc366qjvdrvuuBlvO3MEa8hxWAo98UnjQ3v0ZrfCEWcPUdNPxts8xP8/BDrxhXLoNzLjDeF+siq0tJogjhteYl25cFUDmG4enmH5jV/RvbroRRbcVLN8GfWeV1ZD3Ac+HKXYZnW4+Yoneel5lm3qAx2xrhu0+yKgAWpFuBnwxdqSbAcU0e9JNY0ty6ebSTW267UneAR/JdJt1CvmnmxOIS7e9AXG+Wf3/QRQKNYtw4jhz5sw4+w0ADpZwH4tToAAAAABJRU5ErkJggg=="); background-size: 100% 100%;}
  .tool_box div.tool2{ background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAP8A/wD/oL2nkwAAA25JREFUeNrtXDFrWzEQdm3qeqjBYOgUjP9C6FKDs5l68C8INtRLhhYc08VZMmUwzl9wXdLNg5cUgxt3MRgMmZsxhXZJho7J4NKhrye4QHiclDwjPUmvd/ARnPjdnb6nk3QnKakUCwsLS8IlCII8YBtQA7QBXUAPcIg/u/j7Gn4v/7+Q0gGcAtZBNFnjc53EkQUNygGagMtAj1yivpzPpKQBFcAQcBuYkVvUL+ykfSKnBPgWxCvCXskHcrKA80c06A9gDugDGoAyoIjPF/FzA/8+x+8/JMJu1lViCoBjwJWiAUucoeri+xvor+PzS4WNK/Sj4BpBY4XTC0BVs70q6pXJ2CVy9gB/JY6eGLZ9IrEr/NlzIazGEnJWgBYgY9iHDNpZSUgaWws3jHVKJpb8mUj8ObY1W1ED8i/AliWCttA+NXBn43SkJJnKJ7bICZE0kSwBSnE4kJYsAleOzaoryWIybdpwRRLnLccIakn8rJg2/IGayk3PVhvObtQSYGg6Kw8nngvHU58FkeDmTBlrEm+k6jhBVcLnpqliV7ies/SkurAk6kl53Ub2iTfR84SgHuF7R7eRz4SRuicE1QnfT3WH15qo5xQ8IahA1JPW2sIMdxXCMk95JODvV6IN27qU1wjlfc8I6hNtqOlS3iaUNzwjqEG0oa1LeZdQXo6Y+Q8AN5oK9DeoLxvBhzKhp2tymixGeH5gaCdjEMGHorFlCm4HhyXK27s2RNB1xF4clkPuQeoedMBjkHoMes+zWEyzWFLXQa95Ja1eSb/kXEyei/0GPOdsXp7Nn3E9SL1MecsVRXlF8YfW8LpnKCk16V1TxpKyq/HUpMGh5/tiI9OGfd9ZfWXasM978xex9HRPT3dMAS/idMSn80HfAU9sOOTLCbMjmzmOy2cU7+ST1VnW0VOuYfkCeGaTJNfOSctIytgMNxdO2osB+UjRsz7aDjebdzWmd7MVjk0zV8PNxm2fi/A6R5CgIGlmuyfFdV9sJNIHWWOxJ40kz4+cyCEN3DgU9Zzdx2blD4TbzGq4EUW3fSzfRr2zKmrIZ4B3mxS7nA43BVmyW88HYlMP8EZszYjdBx0VQC/CzZE6kfvhZpkkv8LNYk/icONwMxtuYmWeYpLU4bbDDKnDjQkKhdv0Hjk/vf7/IAaJ2kEwOSwsLM7JP4/vNCC4vaj4AAAAAElFTkSuQmCC"); background-size: 100% 100%;}
  .tool_box div.tool3{ background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAP8A/wD/oL2nkwAABAFJREFUeNrtnMtLFVEcx6/aW6NF9lhY19RFu6DCKLJNghFFIGpBpphQBC2qRQpuIqtlmY8eED0XPfwXogdIlrVomeKih2lh9kDs4Wv6HvrFOIczc+d675x75vL7wRcv15nfnPnMOWfO4/e7kQgbGxsbGxsbm22WZa2BOqHX0H1omY9zMqB8qAI6B12HHkP90CA0Bk1A4/RZfNcHPaVjxTmVUBTKNB3QGctpt2McX0M3nCz7AtWaDOiyVOAexTFCu6AuKzjrgcrFtUwDdEUq6KsZ/8uFDkDPLX32Aqrz09R1AbqqAoS/pdSP+LEBqBWqgjZAK6AsaD5BLqb+6iL01qdP0X+VGQkIKoA+xLiBSahddNazuGaUYMV6AENQkWmAfkK/XQr8jW5sG5SdhGvnQCVQCzTick1RlgfQalMAqewXdAyaF2A55kBHPR6O6AczTAV0RGN56j3KcUc7JB+A/kC9pDd+B5MJlkl09G1Uc2Xr1trcfNYgK57BZBLLdtLl+p06AbXOAtAjTWVbQDVG1XEX6QJUBo3GOTXYrvEBCkiNiub2EdqhqxCLoK3Q7hgS043cFL1tVTVdjKOW85LDP0AbXWp0LdOxIdUpxkk9TMYJ6biiFu1hMs4R97AE6BmTcUJqUdSieiZjA9qsAPQpJXM1QwFl03KLbAVMx4Z0QQGoisnYgPIVgM4yGSekd/JyCFNxAjovAXrCVJyAKiRA/UzFCWidBGg4EWenoK+08N6cJoByJUBjiTj7PsPRaJoAypQATSfibFxytjANAGVJ9zSViLMfkrM8bmJOZ0OSs2LupJ3OeiVn+/k173T2UHJ2iQeKTmc35MCANAD0Pmn7dTj5tGJyt5Ynq7bDcoXDDl7usB1GFQ6noSUhhJOT9AUzijNUBUWVhBBQMEuu4tWucNweQkDBLdqLV6HkeCTIwKgA4AS77SM2/BX0G0IEKPiNQ0VIiQiSOhwCOHq2nuG02iUQYJPBcPQFL8DpUqo1VlimH9rDX0QQlOK1L6pvk4gXMghM6gKoaPCoCpR8aQIkU0Lw7rq07SYDADWaEMSZ55LFI55SRyo6buqQWz3CgFfpLpBIkLvmEbh5SGNZDnqFH6csgoMgdXkEkzcEnIowFzrhkYrQnfLwFmpu91yq9v9pSRtFxC5O0qx8CyXIDHsks3Rqb1Y+FqNipUNNUTpU0Sz8FxKUqRjXEK/yQlMHZqWKvTQ3G6ROdR/lWawUzZGajfi8HtpLUAZ8+pwwIqHOx4i72mUsEmRKZo0xKZlxwNpJad1BWRdF80dCbWJyGEcz8ds86yLpZDQkiNLGXTN0U2QA0Y8HfKbkmEnSKH3XR8fconMq6UcNODKVjY2NjY2NLVH7CyGZyfPfWdsDAAAAAElFTkSuQmCC"); background-size: 100% 100%;}
  .tool_box div.tool4{ background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAP8A/wD/oL2nkwAAA/dJREFUeNrtnEtIVGEUx0fLSHssEkvINLFoGfTACnVTkBgllD3ASDKqTYtoo+SmEHHXw9KNE/ZYGNi6VZSRMWablhpuStNM7EFPX03/jzky3o/v3rnNfcw3l3PgB4Nz5zvn/Gfuvd/33XMMhdjY2NjY2NjYnFk0Gs0EhaAGtIA7oBcMgTHwE8yAWXot/jZMx3SBVnAUFIMMG/7WgG7wBjwCJTqLcxJ8irpnH8HpBD47pc+06ijMIRCJemdi7Gqg8v1COrZTF1FyQZ3Hwsg2QD7XLorjpXRMWAdx9oFpm0m9B7foulIK8sBysASsA9vovRtgxOaYc2C/lgLRxfODjQSEKMVJjF8E2mgMKxMxbNZGIDjeQHeL3yYBfwE3QQVY5YK/HFAGroPPJj6n6U6YWoHE7VbxTS0O8iLI8tB/FrgAftk4/cKpECdsEdA5H2M5q5VAcFYA+hRB/AEdYKfH/hcmgYM00Rwi39oI1G0SxGWf/HcmMRUI+yVOkckF+TXI9imGx0kI1OHXPGdEcVo1ibuLj7/giv9cuvwAVX7MkKdT8s2Yx3MAHExAOVjhR0C1Jt/OLt6riAkUUcxzzrMyMXEqFb+cRlYmLtAzSZwpsIyViW92yXablYmJE6JtCdnKWZ2YQIUKcf6C1axOTKAjusx7dBXoqkKgLaxMXKAu+WkCq2IU6IkkUDurYhRoUBKollUxCjQuCVTKqhgF+iYJtD4geV2hDX/xQKHZyUAzkkDZARHo66KcvrNAxpwy5Ymvm6dYQQAEypN3G/kibcxpq5TTJN/mjTnVSDkN80TRmNM1KadeXmoYc3on5fSAF6vxfDYq8mlxMuDhIG13KE4vYcecDBiYDTPEvNKktqjEyaCB2XJFzLtNikEznA4ciE17KuWT7Yxbg6f1Yx/EulRMCKUc+t10kNYPDqnSTbZqt52k5aNnxFivKK4a8MJR2hUvILYdJjHXeeFMq/IXmzG3KeIVvSB5Xjncq7jt+15AZSNOUZDeoKiEEw0ylV47tyrBy9FEnIhJgekmv4IwK+Js0kCgRpPYevwMwqoMuD0VG2t0QW4z+XX3i2WT3wHpVEhebxHHfcfLCYci9Vm0IjR4OeOmVoRLFkXkkZSJI51uDy2aWaaow6fMpWYWsSrfQw0ykyY+hWA9otFGt82oRH1d82Khm8zdRGxLkCjzNtqh9OxPpULzGZvF3WN0UT0BtoN8cTrSaZNPDXXHSZRRm2POLjTU6bz2yaUtEj9bMl+BU57NkD0Uqwo891CYPqqmD6W1UcPtqIvCjCVqC09HkTJomSIe3DWDu+ApeAsmRBEB7RnP0esJek8cc48+Y/sfC7CxsbGxsbGxJbB/JQrG4yI0L1MAAAAASUVORK5CYII="); background-size: 100% 100%;}
  .tool_box span{ font-size: 14px; color: #fff;}
</style>