<template>
  <v-container>
    <v-container class="d-flex flex-row justify-center align-start">
      <v-text-field
        v-model="ip"
        @keypress.enter="postIp"
        label="请输入要查询的ip"
        outlined
        dense
        :loading="loading"
        :error="error"
        :error-messages="errorMessages"
        :rules="[rules.validIp]"
      ></v-text-field>
      <v-btn @click="postIp" class="ml-7">查询</v-btn>
    </v-container>
    <v-container>
      <v-textarea
        v-model="result"
        rows="13"
        readonly
        label="查询IP结果："
      ></v-textarea>
    </v-container>
  </v-container>
</template>

<script>
export default {
  data: function () {
    return {
      ip: "",
      result: null,
      loading: false,
      error: false,
      errorMessages: "",
      rules: {
        validIp: (value) =>
          /^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/.test(value) ||
          "请输入正确的IP地址",
      },
    };
  },
  methods: {
    async postIp() {
      console.log(this.ip);

      this.loading = true;
      try {
        let response = await fetch(
          `http://ip-api.com/json/${this.ip}?lang=zh-CN `
        );
        if (response.status != 200) {
          this.error = true;
          this.errorMessages = `IP API异常,HTTP状态码为: ${response.status}`;
        } else {
          this.loading = false;
          this.error = false;
          this.errorMessages = null;
          this.result = JSON.stringify(await response.json(), null, 2);
        }
      } catch (error) {
        this.error = true;
        console.log(error);
        this.errorMessages = "网络异常!请检查网络。";
      }
    },
  },
};
</script>

<style lang="scss"></style>
