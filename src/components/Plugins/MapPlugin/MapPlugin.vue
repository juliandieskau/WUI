<template>
  <div ref="el" id="el">
    <l-map ref="map" v-model:zoom="zoom" v-model:center="center">
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        layer-type="base"
        name="OpenStreetMap"
        :max-zoom="19"></l-tile-layer>
      <l-control position="bottomleft">
        <button
          @click="centerViewOnRobot()"
          title="center view"
          class="floating center"
          :class="position ? 'active' : 'inactive'">
          <IonMdLocate />
        </button>
      </l-control>
      <l-control position="topright">
        <select v-model="selectedFilename">
          <option></option>
          <option v-for="filename in waypointLists" :key="filename" :value="filename">
            {{ filename }}
          </option>
        </select>
        <button v-if="selectedFilename" @click="loadWaypointList(selectedFilename)">
          Load selected
        </button>
        <button v-if="selectedFilename" @click="saveWaypointList(selectedFilename)">
          Save selected
        </button>
        <button v-if="!selectedFilename" @click="promptWaypointListName()">new list</button>
      </l-control>
      <l-control position="bottomright">
        <button @click="addWaypointMiddle" title="add waypoint" class="floating addwp">
          <IcSharpAddLocationAlt />
        </button>
        <button
          @click="stopWaypoints"
          title="stop"
          class="floating pause"
          v-if="waypoint_is_executing">
          <MaterialSymbolsPauseCircle />
        </button>
        <button @click="executeWaypoints" title="start" class="floating play" v-else>
          <MaterialSymbolsPlayCircle />
        </button>
        <button
          @click="toggleRepeat"
          title="repeat"
          class="floating repeat"
          :class="waypointList?.cyclic ? 'active' : 'inactive'">
          <EmojioneMonotoneRepeatButton />
        </button>
      </l-control>
      <l-marker v-if="props.refs.get('/ects/control/position')" :lat-lng="position!">
        <l-icon style="background-color: transparent; border: 0" :icon-anchor="[18, 20]">
          <SolarMapArrowLeftBold
            style="color: red; font-size: 3em"
            :style="`transform: rotate(${angle}rad)`" />
        </l-icon>
      </l-marker>
      <template v-if="props.refs.get('#waypoint_list')">
        <template v-if="current_waypoint_index != null">
          <!--dotted line from robot to current waypoint-->
          <l-polyline
            :color="waypoint_is_executing ? 'green' : 'gray'"
            dash-array="6, 8"
            v-if="position"
            :lat-lngs="[
              [
                waypointList.waypoints[current_waypoint_index].pose.x,
                waypointList.waypoints[current_waypoint_index].pose.y
              ],
              [position[0], position[1]]
            ]" />
          <!--line from last to next waypoint-->
          <l-polyline
            :color="waypoint_is_executing ? 'green' : 'gray'"
            :lat-lngs="
              waypointList.waypoints
                .slice(current_waypoint_index - 1, current_waypoint_index + 1)
                .map(waypoint => [waypoint.pose.x, waypoint.pose.y])
            " />
          <!--line from first to current waypoint-->
          <l-polyline
            color="gray"
            :lat-lngs="
              waypointList.waypoints
                .slice(0, current_waypoint_index)
                .map(waypoint => [waypoint.pose.x, waypoint.pose.y])
            " />
          <!--line from current to last waypoint-->
          <l-polyline
            :color="waypoint_is_executing ? 'orange' : 'gray'"
            :lat-lngs="
              waypointList.waypoints
                .slice(current_waypoint_index)
                .map(waypoint => [waypoint.pose.x, waypoint.pose.y])
            " />
          <!--line from last to first if cyclic-->
        </template>
        <template v-else>
          <!--lines between waypoints when unknown current waypoint-->
          <l-polyline
            :color="waypoint_is_executing ? 'green' : 'gray'"
            :lat-lngs="
              waypointList.waypoints.map(waypoint => [waypoint.pose.x, waypoint.pose.y])
            " />
        </template>
        <l-polyline
          color="gray"
          v-if="position && waypointList.cyclic"
          dash-array="1, 16"
          :lat-lngs="[
            [
              waypointList.waypoints[waypointList.waypoints.length - 1].pose.x,
              waypointList.waypoints[waypointList.waypoints.length - 1].pose.y
            ],
            [waypointList.waypoints[0].pose.x, waypointList.waypoints[0].pose.y]
          ]" />
        <l-marker
          v-for="(waypoint, index) in waypointList.waypoints"
          :key="index"
          :lat-lng="[waypoint.pose.x, waypoint.pose.y]"
          draggable
          @dragstart="event => dragStart(event, index)"
          @dragend="event => dragEnd(event, index)">
          <l-tooltip>
            <h2>{{ waypoint.name }} ({{ index }})</h2>
            <br />
            radius: {{ waypoint.radius.toFixed(2) }}<br />
            wait time: {{ waypoint.wait_time.toFixed(2) }}<br />
            use heading: {{ waypoint.use_heading }}<br />
            heading accuracy: {{ waypoint.heading_accuracy.toFixed(2) }}<br />
          </l-tooltip>
          <l-popup class="popup">
            <div class="popup-header">
              <h1>#{{ index }}:</h1>
              <div>
                <label>swap to</label>
                <select
                  v-model="swap_selected"
                  @change="() => reorderWaypoints(swap_selected, index)">
                  <option
                    v-for="(_, swap_index) in waypointList.waypoints"
                    :key="swap_index"
                    :value="swap_index"
                    :selected="swap_index == index">
                    {{ swap_index }}
                  </option>
                </select>
              </div>
            </div>
            <form>
              <div>
                <label>name</label>
                <input v-model="waypoint.name" />
              </div>
              <div>
                <label>radius</label>
                <input v-model="waypoint.radius" type="number" />
              </div>
              <div>
                <label>wait time</label>
                <input v-model="waypoint.wait_time" type="number" />
              </div>
              <div>
                <label>use-heading</label>
                <input v-model="waypoint.use_heading" type="checkbox" />
              </div>
              <template v-if="waypoint.use_heading">
                <div class="horizontal">
                  <label>heading</label>
                  <div class="vertical">
                    <input
                      v-model="waypoint_pose_theta"
                      type="range"
                      :max="2 * Math.PI + 0.1"
                      :min="0"
                      :step="Math.PI / 8"
                      @input="
                        () => {
                          waypoint.pose.theta = +waypoint_pose_theta;
                        }
                      " />
                    <input
                      v-model="waypoint.pose.theta"
                      type="number"
                      :max="2 * Math.PI + 0.1"
                      :min="0"
                      :step="Math.PI / 8" />
                  </div>
                </div>
                <div class="horizontal">
                  <label>heading-accuracy</label>
                  <div class="vertical">
                    <input
                      v-model="waypoint_heading_accuracy"
                      type="range"
                      :max="Math.PI + 0.1"
                      :min="0"
                      :step="Math.PI / 16"
                      @input="
                        () => {
                          waypoint.heading_accuracy = +waypoint_heading_accuracy;
                        }
                      " />
                    <input
                      v-model="waypoint.heading_accuracy"
                      type="number"
                      :max="Math.PI + 0.1"
                      :min="0"
                      :step="Math.PI / 16" />
                  </div>
                </div>
              </template>
              <button
                type="submit"
                @click.prevent="() => editWaypoint(index, waypoint)"
                class="submit">
                save
              </button>
            </form>
            <button type="button" @click.prevent="() => removeWaypoint(index)" class="delete">
              <MaterialSymbolsDeleteForever />
            </button>
          </l-popup>
        </l-marker>
        <l-circle
          v-for="(waypoint, index) in waypointList.waypoints"
          :key="index"
          :lat-lng="[waypoint.pose.x, waypoint.pose.y]"
          :radius="waypoint.radius"
          color="blue" />
        <template
          v-for="(waypoint, innerIndex) in waypointList.waypoints.filter(
            waypoint => waypoint.use_heading
          )"
          :key="innerIndex">
          <l-polyline
            color="blue"
            :class="angleInUtm(waypoint.pose)"
            :lat-lngs="[
                        // line through current waypoint in direction of heading
                        [waypoint.pose.x, waypoint.pose.y],
                        angleInUtm(waypoint.pose) as L.LatLng
                    ]"
        /></template>
      </template>
    </l-map>
  </div>
</template>

<script setup lang="ts">
import 'leaflet/dist/leaflet.css';
import {
  LMap,
  LTileLayer,
  LControl,
  LMarker,
  LIcon,
  LPolyline,
  LTooltip,
  LPopup,
  LCircle
} from '@vue-leaflet/vue-leaflet';
import { computed, onMounted, onUnmounted, ref, watch, type Ref } from 'vue';
import L, { DragEndEvent, LatLng, type PointTuple } from 'leaflet';
import { ects_msgs, geometry_msgs, nav_msgs, std_msgs } from '@/ECTS/Types/Messages';
import { ECTS } from '@/ECTS/ECTS';
import ROSLIB from 'roslib';
import Quaternion from 'quaternion';
import 'leaflet.utm';

import IonMdLocate from '~icons/ion/md-locate';
import IcSharpAddLocationAlt from '~icons/ic/sharp-add-location-alt';
import MaterialSymbolsDeleteForever from '~icons/material-symbols/delete-forever';
import MaterialSymbolsPlayCircle from '~icons/material-symbols/play-circle';
import MaterialSymbolsPauseCircle from '~icons/material-symbols/pause-circle';
import SolarMapArrowLeftBold from '~icons/solar/map-arrow-left-bold';
import EmojioneMonotoneRepeatButton from '~icons/emojione-monotone/repeat-button';

const props = defineProps({
  refs: { type: Object, required: true, default: () => {} }
});

const el: Ref<HTMLDivElement | null> = ref(null);
const zoom: Ref<number> = ref(18);
const center: Ref<PointTuple> = ref([49.01550865987086, 8.425810112163253]);

const waypointLists: Ref<string[]> = ref([]);
let waypointListState: ects_msgs.WaypointList | null = null;
const waypointList = computed(() => {
  const value = props.refs.get('#waypoint_list') as ects_msgs.WaypointList;
  waypointListState = {
    ...value,
    waypoints: value?.waypoints
      .map((waypoint, index) => {
        if (index == waypointUpdateSuppressed.value) {
          console.log('suppress waypoint update', index);
          return waypointListState?.waypoints[index] || waypoint;
        } else return waypoint;
      })
      .filter(waypoint => waypoint != null)
  };
  return value;
});
const waypointUpdateSuppressed = ref(-1);
const selectedFilename = ref('');
const waypoint_pose_theta = ref(0);
const waypoint_heading_accuracy = ref(0);
const swap_selected = ref(0);

const ects = computed(() => props.refs.get('#ects') as ECTS);

const position = computed(() => {
  const pos = props.refs.get('/ects/control/position') as nav_msgs.Odometry;
  if (!pos) return null;
  const latLng = utmToLatLng(pos.pose.pose.position.x, pos.pose.pose.position.y);
  return [latLng.lat, latLng.lng] as PointTuple;
});

const angle = computed(() => {
  const pos = props.refs.get('/ects/control/position') as nav_msgs.Odometry;
  if (!pos) return null;
  const [x, y, z, w] = [
    pos.pose.pose.orientation.x,
    pos.pose.pose.orientation.y,
    pos.pose.pose.orientation.z,
    pos.pose.pose.orientation.w
  ];
  const q = new Quaternion(w, x, y, z);
  return -q.toEuler().yaw + Math.PI;
});

const current_waypoint_index = computed(() => {
  const index = (props.refs.get('/ects/waypoints/current_waypoint') as std_msgs.UInt32)?.data;
  if (index == null || index >= waypointList.value?.waypoints?.length!) return null;
  return index;
});

const waypoint_is_executing = computed(() => {
  return (props.refs.get('/ects/waypoints/is_executing') as std_msgs.Bool)?.data ?? false;
});

const observer = new IntersectionObserver(() => {
  if (el.value?.parentElement?.style.display != 'none') {
    window.dispatchEvent(new Event('resize'));
  }
});
onMounted(() => {
  observer.observe(el.value!);
});

onUnmounted(() => {
  observer.disconnect();
});

loadWaypointListDir();

watch(
  () => props.refs.get('/ects/control/position'),
  (value, oldValue) => {
    // when the robot position is received first time, center the view on it
    if (value && !oldValue) {
      centerViewOnRobot();
    }
  }
);

watch(
  () => props.refs.get('#waypoint_list'),
  (value, oldValue) => {
    if (!value && oldValue) {
      reset();
    }
  }
);
/**
 * @description DragStartEvent on a waypoint marker. Start suppression of waypoint list updates.
 * @param event the event that got fired
 */
function dragStart(event: Event, index: number) {
  console.groupCollapsed('drag event', index);
  console.log('start suppressing waypoint', index);
  waypointUpdateSuppressed.value = index;
}

/**
 * @description DragEndEvent on a waypoint marker. End suppression of waypoint list updates.
 * @param event the event that got fired
 * @param index the index of the waypoint to move
 */
function dragEnd(event: DragEndEvent, index: number) {
  console.log('end suppressing waypoint', index);
  waypointUpdateSuppressed.value = -1;
  moveWaypoint(event, index);
  console.groupEnd();
}

/**
 * @description Executes the current waypoint list.
 */
function executeWaypoints() {
  const topic = new ROSLIB.Topic({
    ros: ects.value.getRos(),
    name: '/ects/waypoints/execute',
    messageType: 'std_msgs/Empty'
  });
  ects.value.sendMessage(topic, new ROSLIB.Message({}));
}

/**
 * @description Stops the current waypoint list.
 */
function stopWaypoints() {
  const topic = new ROSLIB.Topic({
    ros: ects.value.getRos(),
    name: '/ects/waypoints/stop',
    messageType: 'std_msgs/Empty'
  });
  ects.value.sendMessage(topic, new ROSLIB.Message({}));
}

/**
 * @description Toggles the cyclic property of the current waypoint list.
 */
function toggleRepeat() {
  const topic = new ROSLIB.Topic({
    ros: ects.value.getRos(),
    name: '/ects/waypoints/repeat_waypoints',
    messageType: 'std_msgs/Bool'
  });
  ects.value.sendMessage(
    topic,
    new ROSLIB.Message({ data: !waypointList.value?.cyclic } as std_msgs.Bool)
  );
}

/**
 * @description Gets the waypointList directory from disk.
 */
function loadWaypointListDir() {
  ects.value
    .callService(
      '/ects/waypoints/saved_lists',
      'ects/WaypointListDirectory',
      new ROSLIB.ServiceRequest({})
    )
    .then(response => {
      const responseCast = response as ects_msgs.WaypointListDirectory;
      waypointLists.value = responseCast.filenames;
    });
}

/**
 * @description Resets the waypointList.
 */
function reset() {
  waypointLists.value = [];
  selectedFilename.value = '';
  props.refs.set('/ects/waypoints/waypoint_list', null);
  console.log('reset waypoint list');
}

/**
 * @description Loads a waypoint list from disk.
 * @param name The name of the waypoint list to load.
 */
function loadWaypointList(name: string) {
  return ects.value.callService(
    '/ects/waypoints/load_waypoint_list',
    'ects/LoadWaypointList',
    new ROSLIB.ServiceRequest({
      filename: name
    })
  );
}
/**
 * @description Saves a waypoint list to disk.
 * @param name The name of the waypoint list to save.
 */
function saveWaypointList(name: string) {
  return ects.value.callService(
    '/ects/waypoints/save_waypoint_list',
    'ects/SaveWaypointList',
    new ROSLIB.ServiceRequest({
      filename: name
    })
  );
}
/**
 * @description Prompts the user for a name and saves the current waypoint list to disk under the new name.
 */
function promptWaypointListName() {
  let name = prompt('Please enter a name for the new waypoint list', '');
  if (!name?.endsWith('.waypoints')) {
    name += '.waypoints';
  }
  if (name) {
    saveWaypointList(name).then(() => {
      loadWaypointListDir();
    });
  }
}
/**
 * @description Places a new Waypoint in the middle of the screen.
 */
function addWaypointMiddle() {
  console.groupCollapsed('add waypoint', waypointList.value?.waypoints.length);
  console.log(center.value);
  if (!waypointList.value) return;
  const ects: ECTS = props.refs.get('#ects');
  const utm = latLngToUtm(
    (center.value as unknown as LatLng).lat,
    (center.value as unknown as LatLng).lng
  );
  const message = {
    waypoint: {
      name: 'new waypoint',
      pose: {
        x: utm.x,
        y: utm.y,
        theta: 0
      },
      radius: 1
    },
    index: waypointList.value.waypoints.length
  } as ects_msgs.AddWaypoint;
  console.log(message);
  ects.sendMessage(
    new ROSLIB.Topic({
      ros: ects.getRos(),
      name: '/ects/waypoints/add_waypoint',
      messageType: 'ects/AddWaypoint'
    }),
    new ROSLIB.Message(message)
  );
  console.groupEnd();
}
/**
 * @description DragEndEvent on a waypoint marker. Moves the waypoint to the new position
 * @param event the event that got fired
 * @param index the index of the waypoint to move
 */
function moveWaypoint(event: DragEndEvent, index: number) {
  if (!waypointList.value) return;
  const waypointLatLng = waypointList.value.waypoints[index];
  waypointLatLng.pose.x = event.target.getLatLng().lat;
  waypointLatLng.pose.y = event.target.getLatLng().lng;
  editWaypoint(index, waypointLatLng);
}
/**
 * @description Sends a message to the backend to replace a waypoint
 * @param index the index of the waypoint to replace
 * @param waypoint the waypoint
 */
function editWaypoint(index: number, waypoint: ects_msgs.Waypoint) {
  console.log('edit waypoint', index);
  const utm = latLngToUtm(waypoint.pose.x, waypoint.pose.y);
  const waypointUtm = {
    ...waypoint,
    pose: { x: utm.x, y: utm.y, theta: waypoint.pose.theta }
  } as ects_msgs.Waypoint;
  const ects: ECTS = props.refs.get('#ects');
  ects.sendMessage(
    new ROSLIB.Topic({
      ros: ects.getRos(),
      name: '/ects/waypoints/replace_waypoint',
      messageType: 'ects/ReplaceWaypoint'
    }),
    new ROSLIB.Message({
      index_to_replace: index,
      replacement_waypoint: waypointUtm
    } as ects_msgs.ReplaceWaypoint)
  );
}
/**
 * @description removes a waypoint from the waypoint list
 * @param index the index of the waypoint to remove
 */
function removeWaypoint(index: number) {
  console.log('send remove waypoint', index);
  const ects: ECTS = props.refs.get('#ects');
  ects.sendMessage(
    new ROSLIB.Topic({
      ros: ects.getRos(),
      name: '/ects/waypoints/remove_waypoint',
      messageType: 'ects/ReplaceWaypoint'
    }),
    new ROSLIB.Message({
      index: index
    } as ects_msgs.RemoveWaypoint)
  );
}
/**
 * Permutes the waypointlist to move the from_index into the to_index
 * @param from_index the index of the waypoint to move
 * @param to_index the index which will be the new index for the waypoint
 */
function reorderWaypoints(from_index: number, to_index: number) {
  const permutation = Array.from(Array(waypointList.value?.waypoints.length).keys());
  permutation.splice(to_index, 0, permutation.splice(from_index, 1)[0]);
  ects.value.sendMessage(
    new ROSLIB.Topic({
      ros: ects.value.getRos(),
      name: '/ects/waypoints/reorder_waypoints',
      messageType: 'ects/ReorderWaypoints'
    }),
    new ROSLIB.Message({
      new_indices: permutation
    }) as ects_msgs.ReorderWaypoints
  );
}
/**
 * @description Centers the map on the coordinates and sets the zoom level to 20.
 * @param latLng The coordinates to center the map on.
 */
function centerView(latLng: L.LatLng) {
  zoom.value = 20;
  center.value = [latLng.lat, latLng.lng];
}
/**
 * @description Centers the map on the robot.
 */
function centerViewOnRobot() {
  console.log('center view on robot', position.value);
  if (position.value) {
    centerView({ lat: position.value[0], lng: position.value[1] } as L.LatLng);
  }
}
/**
 * @description convert utm to LatLng
 * @param x utm x
 * @param y utm y
 */
function utmToLatLng(x: number, y: number) {
  const latLng = L.utm({
    x: x,
    y: y,
    zone: 32,
    band: 'U',
    southHemi: false
  }).latLng();
  return latLng;
}
/**
 * @description convert LatLng to utm
 * @param lat latitude
 * @param lng longitude
 */
function latLngToUtm(lat: number, lng: number) {
  const latlng = new L.LatLng(lat, lng);
  const utm = latlng.utm(32, false);
  return utm;
}
/**
 * @description calculates the coordinates of a point 8m in front of the robot
 * @param pose the center of the robot
 */
function angleInUtm(pose: geometry_msgs.Pose2D) {
  const utm = latLngToUtm(pose.x, pose.y);
  utm.x += Math.cos(pose.theta) * 8;
  utm.y += Math.sin(pose.theta) * 8;
  const latLng = utmToLatLng(utm.x, utm.y);
  return latLng;
}
</script>

<style scoped>
#el {
  height: 100%;
  width: 100%;
}

:global(.leaflet-div-icon) {
  background: transparent;
  border: 0;
}

:global(.leaflet-popup-content > .popup) {
  width: 250px;
}

.popup > form {
  display: flex;
  flex-direction: column;
  gap: 2px;
  align-items: stretch;
  justify-items: center;
}

.popup > form > div {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.popup > form > div > input {
  width: 50%;
}

.popup > form > div > input[type='checkbox'] {
  width: 13px;
}

button.delete {
  color: var(--color-important);
}

button.submit {
  width: 100%;
  color: var(--color-success);
  font-weight: bolder;
}

button.floating {
  margin: 10px 0;
  border-radius: 500px;
  aspect-ratio: 1;
  font-size: 3em;
  color: white;
  border: 1px solid black;
  display: flex;
  align-items: center;
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.25);
}

button.floating:hover {
  outline: 1px solid black;
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.5);
}

.addwp {
  background-color: rgb(0, 147, 233);
}

.addwp:hover {
  background-color: rgb(0, 162, 255);
}

.play {
  background-color: rgb(3, 194, 3);
}

.play:hover {
  background-color: rgb(0, 229, 0);
}

.pause {
  background-color: rgb(255, 0, 0);
}

.pause:hover {
  background-color: rgb(255, 51, 51);
}

.repeat.active {
  background-color: rgb(255, 174, 0);
}

.repeat.inactive {
  background-color: rgb(105, 72, 1);
}

.center {
  background-color: red;
}

.center.inactive {
  background-color: lightgray;
}

.popup-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.vertical {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

.horizontal {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
</style>
