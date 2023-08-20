<template>
  <div class="col-md-6 col-sm-12">
    <div class="m-3 card">
      <h2 class="pb-5 date-format">{{watch.getTime().getTimezone()}}</h2>
      <div class="watch" :style="watchStyle">
        <div class="screen" :class="{'light-on': watch.lightOn }">
          <div class="hours" style="display: inline-block;">{{watch.getTime().formatTime()['hoursMinutes']}}</div>
          <div style="display: inline-block; margin-left:5px;">
            <span class="date-format">{{watch.getTime().formatTime()['hoursFormat']}}</span>
            <span>{{watch.getTime().formatTime()['seconds']}}</span>
          </div>
        </div>
        <div class="button top-left" @click="watch.resetTime();$forceUpdate()"></div>
        <div class="button top-right" @click="watch.changeMode()"></div>
        <div class="button bottom-left" @click="watch.turnLight();$forceUpdate()"></div>
        <div class="button bottom-right" @click="watch.updateTime();$forceUpdate()"></div>
        <div class="button middle-left" @click="watch.changeTimeFormat();$forceUpdate()"></div>
      </div>
      <div style="bottom:20px; position:absolute">
        <button button type="button" class="btn btn-dark mx-2" v-on:click="resetPosition()" style="color:white;">Reset Position</button>
        <button button type="button" v-if="!isAnimated" class="btn btn-info mx-2" v-on:click="startAnimation()" style="color:white;">Start Animation</button>
        <button button type="button" v-if="isAnimated" class="btn btn-danger mx-2" v-on:click="stopAnimation()" style="color:white;">Stop Animation</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Watch, Time } from '../utils/models'

@Component
export default class WatchComponent extends Vue {
  @Prop() private watch!: Watch;
  private watchStyle = {};
  private rotation: number = 0;
  private isAnimated = false;
  private animation: number | undefined = undefined;

  mounted() {
    setInterval(this.updateTime, 1000);
  }

  public updateTime(){
    this.watch.getTime().updateTime();
    this.$forceUpdate();
  }

  public animate() {
    let p = this.watch.animate()
    this.watchStyle = {
      left: p.getX() + 'px',
      top: p.getY() + 'px',
      transform: `rotate(${this.rotation}deg)`
    }
    this.rotation += this.watch.getAngle();
  }

  public startAnimation() {
    this.animation = setInterval(this.animate, 300);
    this.isAnimated = !this.isAnimated;
  }

  public stopAnimation() {
    clearInterval(this.animation);
    this.animation = undefined;
    this.isAnimated = !this.isAnimated;
  }

  public resetPosition() {
    this.watchStyle = {
      left: '0px',
      top: '0px',
      transform: `rotate(0deg)`
    };
    this.rotation = 0;
    this.watch.resetPosition();
  }
}
</script>

<style scoped>
.card {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 600px;
  margin: 0;
  background-color: #f0f0f0;
}

.watch {
  width: 200px;
  height: 200px;
  background-color: rgb(49, 180, 212);
  border-radius: 50%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.screen {
  width: 120px;
  height: 60px;
  background-color: white;
  position: relative;
  z-index: 1;
  border-radius: 5%;
  text-align: center;
  padding-top: 20px;
}

.button {
  width: 20px;
  height: 10px;
  background-color: rgb(82, 202, 223);
  position: absolute;
}

.top-left {
  top: 20px;
  left: 15px;
  transform: rotate(-45deg);
  cursor: pointer;
}

.top-right {
  top: 20px;
  right: 15px;
  transform: rotate(45deg);
  cursor: pointer;
}

.bottom-left {
  bottom: 20px;
  left: 15px;
  transform: rotate(-135deg);
  cursor: pointer;
}

.bottom-right {
  bottom: 20px;
  right: 15px;
  transform: rotate(135deg);
  cursor: pointer;
}

.middle-left {
  bottom: 100px;
  left: -17px;
  transform: rotate(-90deg);
  cursor: pointer;
  background-color: rgb(0, 0, 0);
}

.light-on {
  background-color: rgb(37, 37, 37);
  color: rgb(203, 204, 204);
}

.date-format {
  position: absolute;
  display: block;
  top: 10px;
}
.hours {
  font-size: 24px;
}
</style>
