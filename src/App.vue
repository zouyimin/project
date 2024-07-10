<template>
  <div class="carousel">
    <div
      class="carousel-inner"
      :class="{noTransition}"
      :style="{
        transform: `translateX(-${currentSlide}px)`,
        width: `${items.length * slideWidth}px`,
      }"
    >
      <div v-for="(item, index) in items" :key="index" class="carousel-item">
        {{ item }}
      </div>
    </div>
    <button class="prev" @click="autoPrev">Prev</button>
    <button class="next" @click="autoNext">Next</button>
  </div>
</template>
 
<script>
import { ref, reactive, onMounted, onUnmounted } from "vue";
import request from '@/utils/request'

export default {
  setup() {
    const slideWidth = ref(800); // 视图容器的宽
    const timing = 2000 // 轮播时间
    const items = reactive([]);
    let currentIndex = 1;
    let currentSlide = ref(800);
    let nextTimer, prevTimer;
    let noTransition = ref(false)

    const fechData = async () => {
      const data = await request({
        url: '/all.json',
        method: 'get'
      })
      return data.content.split('')
    }

    const next = () => {
      if (currentIndex === items.length - 1) {
        clearInterval(nextTimer)
        nextTimer = null
        noTransition.value = true // 清除动画效果
        currentIndex = 0 // 将视图切到第一个item
        currentSlide.value = currentIndex * slideWidth.value;
        setTimeout(() => {
          autoNext()
        }, 20);
        return
      }
      currentIndex++;
      currentSlide.value = currentIndex * slideWidth.value;
    };

    const prev = () => {
      if (currentIndex === 0) {
        clearInterval(prevTimer)
        prevTimer = null
        noTransition.value = true // 清除动画效果
        currentIndex = items.length - 1 // 将视图切到最后一个item
        currentSlide.value = currentIndex * slideWidth.value;
        setTimeout(() => {
          autoPrev()
        }, 20);
        return
      }
      currentIndex--;
      currentSlide.value = currentIndex * slideWidth.value;
    };

    const autoNext = () => {
      if (nextTimer) return // 避免设置多个定时器
      clearInterval(prevTimer)
      prevTimer = null
      noTransition.value = false
      next();
      nextTimer = setInterval(next, timing);
    };

    const autoPrev = () => {
      if (prevTimer) return
      clearInterval(nextTimer)
      nextTimer = null
      noTransition.value = false
      prev();
      prevTimer = setInterval(prev, timing);
    };

    onMounted(() => {
      fechData().then((res) => {
        for (const v of res) {
          items.push(v)
        }
        items.unshift(res[res.length - 1]) // 拼接items
        // console.log(items)
        setTimeout(() => {
          autoNext()
        }, timing);
      })
    });

    onUnmounted(() => {
      clearTimeout(nextTimer); // 销毁前清除定时器
      clearTimeout(prevTimer);
    });

    return { currentSlide, slideWidth, autoNext, autoPrev, items, noTransition };
  },
};
</script>
 
<style scoped>
.carousel {
  width: 800px;
  height: 400px;
  position: relative;
  overflow: hidden;
}

.carousel-inner {
  height: 100%;
  background-color: #efefef;
  transition: 2s ease;
}

.carousel-inner.noTransition {
  transition: none;
}

.carousel-item {
  width: 800px;
  height: 100%;
  float: left;
  text-align: center;
  font-size: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.prev,
.next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  border: none;
  padding: 10px;
  cursor: pointer;
}

.prev {
  left: 10px;
}

.next {
  right: 10px;
}
</style>