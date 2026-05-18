<!--
=======================================================================================================================================
SCRIPT
=======================================================================================================================================
-->
<script lang="ts" setup>
import { UserRole } from "~~/server/features/user/business/types/userRole";

const props = defineProps<{
  mobile?: boolean;
}>();

const { authenticated, user, logout } = useSsoSession();
const { openLoginDialog } = useLoginDialog();

async function handleLogout() {
  await logout();
}

function handleLogin() {
  openLoginDialog(window.location.toString());
}
</script>

<!--
=======================================================================================================================================
TEMPLATE
=======================================================================================================================================
-->
<template>
  <v-menu v-if="authenticated && user" :close-on-content-click="true">
    <template v-slot:activator="{ props }">
      <div
        v-bind="props"
        variant="text"
        color="accent"
        @click="props.onClick"
        class="cursor-pointer d-flex align-center px-2"
      >
        <v-avatar size="32">
          <v-img :src="user.imagePath" :alt="user.name" />
        </v-avatar>
        <v-icon class="ml-2">mdi-chevron-down</v-icon>
      </div>
    </template>

    <v-list>
      <v-list-item>
        <v-list-item-title>{{ user.name }}</v-list-item-title>
      </v-list-item>
      <v-divider class="mx-4 my-1"></v-divider>
      <v-list-item to="/tournaments">
        <template v-slot:prepend>
          <v-icon>mdi-trophy</v-icon>
        </template>
        <template v-slot:title>Mes tournois</template>
      </v-list-item>
      <v-divider class="mx-4 my-1"></v-divider>
      <v-list-item v-if="user.role === UserRole.ADMIN" to="/admin">
        <template v-slot:prepend>
          <v-icon>mdi-view-dashboard-outline</v-icon>
        </template>
        <template v-slot:title>Dashboard</template>
      </v-list-item>
      <v-divider class="mx-4 my-1"></v-divider>
      <v-list-item @click="handleLogout">
        <template v-slot:prepend>
          <v-icon>mdi-logout</v-icon>
        </template>
        <template v-slot:title>Se déconnecter</template>
      </v-list-item>
    </v-list>
  </v-menu>

  <template v-else>
    <v-btn class="bg-white" @click="handleLogin">
      <span v-if="!mobile" class="!text-xs font-bold"
        >Se connecter / s'inscrire</span
      >
      <span v-else class="!text-xs font-bold">Connexion</span>
    </v-btn>
  </template>
</template>

<!--
=======================================================================================================================================
CSS
=======================================================================================================================================
-->
<style scoped lang="scss">
:deep(.v-list-item__spacer) {
  width: 8px !important;
}
</style>
