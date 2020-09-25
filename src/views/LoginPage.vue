<template>
<div id="app">
    <v-app id="inspire">
        <v-app id="inspire">
        <v-content>
            <v-container
            class="fill-height"
            fluid
            >
            <v-row
                align="center"
                justify="center"
            >
                <v-col
                cols="12"
                sm="8"
                md="4"
                >
                <v-card class="elevation-12">
                    <v-toolbar
                    color="primary"
                    dark
                    flat
                    >
                    <v-toolbar-title>Login form</v-toolbar-title>
                    <v-spacer></v-spacer>
                    </v-toolbar>
                    <v-card-text>
                    <v-form>
                        <v-text-field
                        label="Client ID"
                        name="login"
                        prepend-icon="mdi-account"
                        type="number"
                        v-model="login"
                        ></v-text-field>
    
                        <v-text-field
                        id="password"
                        label="Password"
                        name="password"
                        prepend-icon="mdi-lock"
                        type="password"
                        v-model="password"
                        ></v-text-field>
                    </v-form>
                    </v-card-text>
                    <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn 
                        color="primary"
                        @click="tryToAuthenticate()"
                    >Login</v-btn>
                    </v-card-actions>
                </v-card>
                </v-col>
            </v-row>
            </v-container>
        </v-content>
        </v-app>
    </v-app>
</div>
</template>

<script>
import axios from "axios"

export default {
    data: () => ({
        login: "",
        password: ""
    }),
    methods: {
        tryToAuthenticate() {
            let params = {
                "client_id":this.login,
                "secret":this.password
            }

            axios.get('https://numberplates.msht.eu:14556/clientmanager/api/v1/clients/verify', { params }).then((resp)=>{
                if(resp.data["valid"]){
                    this.$store.commit("login", {"status":true, "clientId":params["client_id"], "authSecret":params["secret"]});
                }else{
                    this.$toastr.e("Bad username or password.");
                }
            }).catch(res => {
                if (res.message) {
                    this.$toastr.e(res.message);
                } else {
                    this.$toastr.e("Undefined");
                }
            });
        }
    }
}
</script>