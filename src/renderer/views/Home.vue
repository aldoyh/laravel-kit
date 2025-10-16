<template>
  <div v-if="project == null" class="h-full bg-white-100 flex-1 p-5 text-gray-700 tracking-wide overflow-y-auto dark:bg-d-blue-500 dark:text-white">
    <h1 class="text-4xl">Laravel Kit</h1>
    <h2 class="mt-3 text-2xl">Artisan تطور</h2>
    <h3 class="mt-3 text-lg">ابدأ</h3>
    <ul class="text-sm">
      <li class="mt-1">
        <span class="cursor-pointer text-blue dark:text-blue-100" @click="openDialog">فتح المشروع...</span>
      </li>
    </ul>
    <h3 class="mt-6 text-lg">مؤخرًا</h3>
    <ul class="text-sm" v-if="recents.length">
      <li class="mt-1" v-for="recent in recents" :key="recent">
        <span class="cursor-pointer text-blue dark:text-blue-100" @click="openProject({ dir: recent })" v-text="basename(recent)"></span>
        <span class="ml-3">{{ recent }}</span>
      </li>
    </ul>
    <span v-else class="text-sm mt-1">لا توجد مشاريع تم فتحها مؤخرًا</span>
    <h3 class="mt-6 text-lg">مساعدة</h3>
    <ul class="text-sm">
      <li class="mt-1" v-for="link in helpLinks" :key="link.id">
        <span class="cursor-pointer text-blue dark:text-blue-100" @click="openLink(link)" :title="link.href">{{ link.name }}</span>
      </li>
    </ul>
  </div>
  <div v-else class="h-full bg-white-100 flex-1 p-5 text-gray-600 flex justify-center items-center dark:bg-d-blue-500 dark:text-white">
    <div class="text-center">
      <h1 class="text-3xl font-semibold">بناء شيء رائع!</h1>
      <kit-button class="mt-10" @clicked="changeTab('ArtisanView')">الذهاب إلى Artisan</kit-button>
      <p class="italic text-lg mt-8">أو</p>
      <kit-button class="mt-10" @clicked="changeTab('TinkerView')">ابدأ في التطوير</kit-button>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import basename from "@/lib/basename.ts";
import KitButton from "@/components/KitButton.vue";
export default {
  name: "HomeView",
  components: { KitButton },
  data() {
    return {
      helpLinks: [
        {
          id: 1,
          name: "ويكي",
          href: "https://github.com/tmdh/laravel-kit/wiki/"
        },
        {
          id: 2,
          name: "مستودع GitHub",
          href: "https://github.com/tmdh/laravel-kit/"
        }
      ]
    };
  },
  methods: {
    ...mapActions(["openDialog", "openProject"]),
    ...mapMutations(["changeTab"]),
    openLink(link) {
      window.kit.openExternal(link.href);
    },
    basename(dir) {
      return basename(dir.toString());
    }
  },
  computed: {
    ...mapState(["project", "name", "dir", "recents"])
  }
};
</script>

<style scoped>
h1,
h2,
h3 {
  font-weight: 300;
}
</style>
