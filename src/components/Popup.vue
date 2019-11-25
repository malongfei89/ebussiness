<template>
    <div v-if="showPopup">
        <div class="popup">
            <button @click="$emit('closePopup')" style="float:right;width:40px;height:40px;background-color:transparent;font-size:30px">&times;</button>
            <div style="top:15%;left:15%;width:70%;height:80%;position:absolute">
                <div class="input-group login-input-group">
                <label :for="forLabel1">{{label1}}</label>
                <input :id="forLabel1" v-model="value1" :type="type1">
                </div>
                <div class="input-group login-input-group">
                <label :for="forLabel2">{{label2}}</label>
                <input :id="forLabel2" v-model="value2" :type="type2">
                </div>
                <button style="float:right;width:65px;min-width:65px;padding:12px;margin-right:18px" @click="validateInput">{{btnValue}}</button>
                <p v-if="btnValue==='Login'" style="width:100%;height:15%;float:right">No account yet? click <router-link class="noback" to="/register">here</router-link> to Register</p>
            </div>
        </div>
        <div class="greyout"  @click="$emit('closePopup')"></div>
    </div>
</template>

<script>
import { Globals } from '@/services/Api'
export default {
    data: () => {
        return {
            value1: null,
            value2: null
        }
    },
    props: ['btnValue', 'type1', 'type2', 'label1', 'label2', 'forLabel1', 'forLabel2', 'showPopup'],
    methods: {
        validateInput () {
            if(this.value1 && this.value2) this.$emit('finished', {value1: this.value1, value2: this.value2})
            else {
                Globals.toastr.push({ type: 'error', message: 'Please fill in all fileds!'})
            }
        }
    }
}
</script>

<style>

</style>