<template>
  <div>
    <h1>Watch page</h1>
    <div class="row">
      <div class="col-lg-4 col-md-6 col-sm-12 px-4"><p style="margin-top:8px">Selected timezone: {{ selectedTimezone }}</p></div>
      <div  class="col-lg-4 col-md-6 col-sm-12 px-4">
        <select class="form-select" v-model="selectedTimezone">
          <option v-for="timezone in timezones" :key="timezone" :value="timezone">{{timezone}}</option>
        </select>
      </div>
      <div class="col-lg-4 col-md-6 col-sm-12 px-4">
        <div class="input-group mb-3">
          <p style="margin-top:8px;margin-right:20px">Watch position: </p>
          <input type="number" v-model="watchPositionX" class="form-control" placeholder="x">
          <input type="number" v-model="watchPositionY" class="form-control" placeholder="y">
        </div>
      </div>
      <div class="col-lg-4 col-md-6 col-sm-12 px-4">
        <div class="input-group mb-3">
          <p style="margin-top:8px;margin-right:20px">Pivot position: </p>
          <input type="number" v-model="pivotPositionX" class="form-control" placeholder="x">
          <input type="number" v-model="pivotPositionY" class="form-control" placeholder="y">
        </div>
      </div>
      <div class="col-lg-4 col-md-6 col-sm-12 px-4">
        <div class="input-group mb-3">
          <p style="margin-top:8px;margin-right:20px">Scaling factor: </p>
          <input type="number" v-model="scalingX" class="form-control" placeholder="x">
          <input type="number" v-model="scalingY" class="form-control" placeholder="y">
        </div>
      </div>
      <div class="col-lg-4 col-md-6 col-sm-12 px-4">
        <div class="input-group mb-3">
          <p style="margin-top:8px;margin-right:20px">Angle: </p>
          <input type="number" v-model="angle" class="form-control" placeholder="x">
        </div>
      </div>
      <div class="col-lg-4 col-md-6 col-sm-12 px-4">
        <button button type="button" class="btn btn-info w-100" v-on:click="createWatch()" style="color:white;">Add a watch</button>
      </div>

    </div>
    <div class="row">
      <WatchComponent v-for="(watch, index) in watches" :key="index" :watch='watch'/>
    </div>
    
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Time, Watch, Matrix3x3, Vector2D, translation } from '../src/utils/models';
import WatchComponent from './components/WatchComponent.vue'
import { timezones } from '../src/utils/static'
import { matrix } from 'mathjs';

@Component({
  components: {
    WatchComponent,
  },
})
export default class App extends Vue {
  watch!: Watch
  watches!: Watch[]
  selectedTimezone!: string;
  timezones = timezones;
  watchPositionX = 0;
  watchPositionY = 0;
  pivotPositionX = 0;
  pivotPositionY = 0;
  scalingX = 0;
  scalingY = 0;
  angle = 0


  created() {
    this.watch = new Watch('Europe/Paris');
    this.watches = [this.watch];
    this.watches.push(new Watch('US/Hawaii'));
    this.selectedTimezone = 'Europe/Paris';
  }

  mounted() {
  }

  public createWatch() {
    let watch = new Watch(
      this.selectedTimezone,
      new Vector2D(this.watchPositionX, this.watchPositionY),
      new Vector2D(this.pivotPositionX, this.pivotPositionY),
      this.scalingX,
      this.scalingY,
      this.angle
    );
    this.watches.push(watch);
    this.$forceUpdate();
  }
}
</script>

<style scoped>
h1 {
  text-align: center;
}
.form-control {
  display: inline-block;
}
.form-control[type="number"] {
  max-width: 100px;
}
</style>