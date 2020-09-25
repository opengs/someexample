<template>
<div>
<v-data-table
    :loading="isLoading"
    loading-text="Loading cameras....."
    :headers="headers"
    :items="cameras"
    :items-per-page="10"
    class="elevation-1"
>
    <template v-slot:top>
    <v-toolbar flat color="white">
        <v-toolbar-title>Cameras</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="newCameraDialog" max-width="500px">
        <template v-slot:activator="{ on }">
            <v-btn color="primary" dark v-on="on">New Camera</v-btn>
            <v-btn color="warning" dark v-on:click="openTestDialog()">Test</v-btn>
        </template>
        <v-card>
            <v-card-title>
                <span class="headline">New Camera</span>
            </v-card-title>

            <v-card-text>
                <v-container>
                    <v-text-field v-model="newCameraName" label="Name"></v-text-field>
                    <v-text-field v-model="newCameraDescription" label="Description"></v-text-field>
                </v-container>
            </v-card-text>

            <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="closeNewCameraDialog">Cancel</v-btn>
            <v-btn color="blue darken-1" text @click="createNewCamera">Create</v-btn>
            </v-card-actions>
        </v-card>
        </v-dialog>
    </v-toolbar>
    </template>
    <template v-slot:item.active="{ item }">
        <v-checkbox
        v-model="item.active"
        @change="setActiveCamera(item.camera_id, item.active)"
        ></v-checkbox>
    </template>
    <template v-slot:item.actions="{ item }">
        <v-btn color="primary" dark v-on:click="openDecoderDialog(item)">Update decoder</v-btn>
        <v-btn color="error" dark v-on:click="deleteCamera(item)">Delete</v-btn>
    </template>
</v-data-table>

<v-dialog v-model="decoderDialog" max-width="500px">
<v-card>
    <v-card-title>
        <span class="headline">Decoder data</span>
    </v-card-title>

    <v-card-text>
        <v-container>
            <v-select
            v-model="currentDecoder"
            :items="decodersNames"
            label="Decoder"
            ></v-select>
            <v-list shaped>
            <v-subheader>Fields</v-subheader>
            <v-list-item-group color="primary">
                <v-list-item
                v-for="(field, i) in currentDecoderFields"
                :key="i"
                >
                <v-list-item-content>
                    <v-text-field persistent-hint v-model="currentDecoderData[field.name]" :label="field.name" :hint="field.description"></v-text-field>
                </v-list-item-content>
                </v-list-item>
            </v-list-item-group>
            </v-list>
        </v-container>
    </v-card-text>

    <v-card-actions>
    <v-spacer></v-spacer>
    <v-btn color="blue darken-1" text @click="closeDecoderDialog">Cancel</v-btn>
    <v-btn color="blue darken-1" text @click="saveNewDecoderData">Update</v-btn>
    </v-card-actions>
</v-card>
</v-dialog>

<v-dialog v-model="testImageDialog">
<v-container
    fluid
  >
    <v-fade-transition mode="out-in">
      <v-row key="0">

        <v-col cols="2" v-for="camera in cameras" :key="cameraHash(camera)">
          <v-card>
            <v-img
              :src="'/device_integrator/api/v1/actions/image?camera_id='+camera.camera_id+'&secret='+$store.state.authSecret+'&client_id=' + $store.state.clientId + '&variant=' + cameraHash(camera) "
              @error="function(err){$toastr.e('Failed to load image from camera ' + camera.camera_id)}"
              @load="function(){camera.imageLoaded=true; updateTestDialogCamera(camera)}"
              contain
              class="grey darken-4 white--text align-end"
            >
            <v-card-title>Camera {{ camera.camera_id }}</v-card-title>
            </v-img>

            <v-card-text>{{ camera.numberplates ? camera.numberplates : "" }}</v-card-text>

            <v-card-actions>
            <v-btn color="primary" block :disabled="!camera.imageLoaded" v-on:click="fetchNumberplates(camera)">
                Load numberplates
            </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>

      </v-row>
    </v-fade-transition>
  </v-container>
</v-dialog>
</div>
</template>

<script>
import axios from 'axios'

export default {
    data: () => ({
        isLoading: true,
        drawer: true,
        newCameraDialog: false,
        newCameraName: "",
        newCameraDescription: "",
        cameras: [],
        headers: [
          {
            text: 'Camera Id',
            align: 'start',
            sortable: false,
            value: 'camera_id',
          },
          { text: 'Name', value: 'name' },
          { text: 'Description', value: 'description' },
          { text: 'Decoder', value: 'decoder' },
          { text: 'Active', value: 'active' },
          { text: 'Actions', value: 'actions'}
        ],
        decoderDialog: false,
        currentCameraId: null,
        decoders: [],
        decodersNames: [],
        currentDecoder: "",
        currentDecoderFields: [],
        currentDecoderData: {},

        testRequestInProgress: false,
        testImageDialog: false
    }),
    methods: {
        updateCameras() {
        this.isLoading = true
        let params = {
            "client_id": this.$store.state.clientId,
            "secret": this.$store.state.authSecret
        }
        axios.get('/device_integrator/api/v1/cameras/all', {
            params
        }).then((resp)=>{
            this.cameras = resp.data.cameras
            this.isLoading = false
        }).catch(res => {
            this.isLoading = false
            if (res.message) {
                this.$toastr.e(res.message);
            } else {
                this.$toastr.e("Undefined");
            }
        });
        },
        setActiveCamera(cameraId, active){
            let data = {
                "camera_id": cameraId,
                "active": active
            }

            let params = {
                "client_id": this.$store.state.clientId,
                "secret": this.$store.state.authSecret
            }

            axios.patch('/device_integrator/api/v1/cameras/active', data, {params}).catch(res => {
                if (res.message) {
                    this.$toastr.e(res.message);
                } else {
                    this.$toastr.e("Undefined");
                }
            });
        },
        createNewCamera(){
            let data = {
                "name": this.newCameraName,
                "description": this.newCameraDescription,
                "decoder":"test",
                "decoder_data":{"val":"te1234st"}
            }

            let params = {
                "client_id": this.$store.state.clientId,
                "secret": this.$store.state.authSecret
            }

            axios.post(
                '/device_integrator/api/v1/cameras/camera',
                data,
                {params}
            ).then(()=>{
                this.updateCameras()
            }).catch(res => {
                if (res.message) {
                    this.$toastr.e(res.message);
                } else {
                    this.$toastr.e("Undefined");
                }
            })

            this.closeNewCameraDialog()
        },
        deleteCamera(item){
            this.closeDecoderDialog()
            this.closeNewCameraDialog()

            let data = {
                "camera_id": item.camera_id
            }

            let params = {
                "client_id": this.$store.state.clientId,
                "secret": this.$store.state.authSecret
            }

            axios.delete(
                '/device_integrator/api/v1/cameras/camera',
                {
                    data: data,
                    params: params
                },
            ).then(()=>{
                this.updateCameras()
            }).catch(res => {
                if (res.message) {
                    this.$toastr.e(res.message);
                } else {
                    this.$toastr.e("Undefined");
                }
            })
        },
        testCamera(camera_id){
            this.testRequestInProgress = true

            let params = {
                "client_id": this.$store.state.clientId,
                "secret": this.$store.state.authSecret,
                "camera_id": camera_id
            }

            axios.get('/device_integrator/api/v1/actions/numberplates', {params}).then(()=>{
                this.testRequestInProgress = false
                
            }).catch(res => {
                this.testRequestInProgress = false
                if (res.message) {
                    this.$toastr.e(res.message);
                } else {
                    this.$toastr.e("Undefined");
                }
            });
        },
        closeNewCameraDialog(){
            this.newCameraDialog = false
            this.newCameraDescription = ""
            this.newCameraName = ""
        },
        openDecoderDialog(item){
            this.decoderDialog = true
            this.currentDecoder = item.decoder
            this.currentDecoderData = item.decoder_data
            this.currentCameraId = item.camera_id
        },
        closeDecoderDialog(){
            this.decoderDialog = false
        },
        saveNewDecoderData(){
            let data = {
                "camera_id": this.currentCameraId,
                "data":{
                    "decoder":this.currentDecoder,
                    "decoder_data":this.currentDecoderData
                }
            }

            let params = {
                "client_id": this.$store.state.clientId,
                "secret": this.$store.state.authSecret
            }

            axios.patch('/device_integrator/api/v1/decoders/camera', data, {params}).catch(res => {
                if (res.message) {
                    this.$toastr.e(res.message);
                } else {
                    this.$toastr.e("Undefined");
                }
            });

            this.closeDecoderDialog()
        },
        loadDecoders(){
            axios.get('/device_integrator/api/v1/decoders/all').then((resp)=>{
                this.decoders = resp.data.decoders
                this.decoders.forEach(dec => this.decodersNames.push(dec["name"]));
            }).catch(res => {
                if (res.message) {
                    this.$toastr.e(res.message);
                } else {
                    this.$toastr.e("Undefined");
                }
            });
        },
        cameraHash: function(camera) {
            var str = JSON.stringify(camera)
            var i, l, hval = 0x811c9dc5;

            for (i = 0, l = str.length; i < l; i++) {
                hval ^= str.charCodeAt(i);
                hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
            }
            return ("0000000" + (hval >>> 0).toString(16)).substr(-8);
        },
        updateTestDialogCamera(camera){
            let index = this.cameras.indexOf(camera)
            this.cameras.splice(index, 1, camera)
            //this.cameras.push(camera)
        },
        fetchNumberplates(camera){
            let params = {
                "client_id": this.$store.state.clientId,
                "secret": this.$store.state.authSecret,
                "camera_id": camera.camera_id
            }

            axios.get('/device_integrator/api/v1/actions/numberplates', {params}).then((resp)=>{
                this.testRequestInProgress = false
                camera.numberplates = resp.data
                this.updateTestDialogCamera(camera)
            }).catch(res => {
                this.testRequestInProgress = false
                if (res.message) {
                    this.$toastr.e(res.message);
                } else {
                    this.$toastr.e("Undefined");
                }
            });
        },
        openTestDialog(){
            this.cameras.forEach(function (camera){
                camera.imageLoaded = false
                camera.numberplates = "Numberplates not fetched"
                camera.ver = (camera.ver) ? camera.ver + 1:1
            })
            this.testImageDialog = true
        }
    },
    watch: {
        currentDecoder: function (val) {
            this.decoders.forEach((dec)=>{
                if (dec.name == val){
                    this.currentDecoderFields = dec.fields
                }
            })
        },
    },
    mounted() {
        this.updateCameras()
        this.loadDecoders()
    }
}
</script>