<template>
  <v-app>
    <v-app-bar color="primary" density="compact">
      <v-app-bar-title class="font-weight-bold">
        <v-btn class="text-none" :to="'/'" variant="text">
          <v-img src="/img/nexus.png" height="36" width="36" class="mr-2" />
          <span class="text-h6"> Nexus Tournament </span>
        </v-btn>
      </v-app-bar-title>
      <v-spacer />
      <div class="ml-8"></div>
      <UserMenu />
    </v-app-bar>
    <v-main>
      <v-container class="pa-6">
        <v-row>
          <v-col
            cols="12"
            md="10"
            offset-md="1"
            lg="8"
            offset-lg="2"
            xl="6"
            offset-xl="3"
          >
            <NuxtPage />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup></script>

<style></style>
