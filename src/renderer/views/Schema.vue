<template>
  <div class="flex-1 p-8 overflow-y-scroll">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-xl">مُصوِّر قاعدة البيانات</h1>
      <div class="flex gap-2">
        <kit-button @clicked="refreshSchema" :disabled="loading" class="inline-flex items-center">
          <svg v-if="!loading" class="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <loading-icon v-else class="ml-2"></loading-icon>
          تحديث المخطط
        </kit-button>
        <kit-button @clicked="showExportOptions" :disabled="!hasSchema" class="inline-flex items-center">
          <svg class="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          تصدير
        </kit-button>
      </div>
    </div>
    
    <div class="h-px bg-gray-300 mb-6"></div>
    
    <!-- Schema Visualization Area -->
    <div v-if="!hasSchema && !loading" class="flex items-center justify-center h-96 bg-gray-50 dark:bg-d-blue-600 rounded-lg border-2 border-dashed border-gray-300 dark:border-d-blue-400">
      <div class="text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">لا يوجد مخطط قاعدة بيانات</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-d-blue-100">انقر على "تحديث المخطط" لتحليل قاعدة البيانات وعرض المخطط</p>
      </div>
    </div>
    
    <div v-else-if="loading" class="flex items-center justify-center h-96">
      <div class="text-center">
        <loading-icon class="mx-auto mb-4"></loading-icon>
        <p class="text-gray-600 dark:text-white">جارٍ تحليل قاعدة البيانات...</p>
      </div>
    </div>
    
    <div v-else id="schema-visualization" class="bg-white dark:bg-d-blue-600 rounded-lg border border-gray-200 dark:border-d-blue-400 p-4 min-h-96">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="table in tables" :key="table.name" class="table-card bg-gray-50 dark:bg-d-blue-700 rounded-lg p-4 border border-gray-200 dark:border-d-blue-500">
          <div class="table-header flex items-center justify-between mb-3">
            <h3 class="font-bold text-lg text-gray-900 dark:text-white">{{ table.name }}</h3>
            <span class="text-xs bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 px-2 py-1 rounded">{{ table.columns.length }} حقل</span>
          </div>
          <div class="table-columns space-y-2">
            <div v-for="column in table.columns" :key="column.name" class="column-row flex items-center justify-between p-2 bg-white dark:bg-d-blue-600 rounded border">
              <div class="column-info">
                <span class="column-name font-medium text-gray-900 dark:text-white">{{ column.name }}</span>
                <span class="column-type text-xs text-gray-500 dark:text-d-blue-100 ml-2">{{ column.type }}</span>
              </div>
              <div class="column-flags flex gap-1">
                <span v-if="column.primary" class="flag bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-100 text-xs px-1 rounded">PK</span>
                <span v-if="column.nullable" class="flag bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-xs px-1 rounded">NULL</span>
                <span v-if="column.unique" class="flag bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 text-xs px-1 rounded">UQ</span>
              </div>
            </div>
          </div>
          <div v-if="table.relationships && table.relationships.length > 0" class="table-relationships mt-3 pt-3 border-t border-gray-200 dark:border-d-blue-500">
            <h4 class="text-sm font-medium text-gray-700 dark:text-d-blue-100 mb-2">العلاقات</h4>
            <div class="space-y-1">
              <div v-for="rel in table.relationships" :key="`${rel.column}-${rel.references_table}`" class="relationship text-xs bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-100 p-1 rounded">
                {{ rel.column }} → {{ rel.references_table }}.{{ rel.references_column }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Export Modal -->
    <div v-if="showExportModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="closeExportModal">
      <div class="bg-white dark:bg-d-blue-700 rounded-lg p-6 max-w-md w-full mx-4" @click.stop>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">تصدير مخطط قاعدة البيانات</h3>
        <div class="grid grid-cols-2 gap-3">
          <button @click="exportSchema('png')" class="export-btn p-3 text-center border border-gray-300 dark:border-d-blue-500 rounded-lg hover:bg-gray-50 dark:hover:bg-d-blue-600">
            <svg class="w-8 h-8 mx-auto mb-2 text-gray-600 dark:text-d-blue-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span class="text-sm font-medium">PNG</span>
          </button>
          <button @click="exportSchema('jpg')" class="export-btn p-3 text-center border border-gray-300 dark:border-d-blue-500 rounded-lg hover:bg-gray-50 dark:hover:bg-d-blue-600">
            <svg class="w-8 h-8 mx-auto mb-2 text-gray-600 dark:text-d-blue-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span class="text-sm font-medium">JPG</span>
          </button>
          <button @click="exportSchema('svg')" class="export-btn p-3 text-center border border-gray-300 dark:border-d-blue-500 rounded-lg hover:bg-gray-50 dark:hover:bg-d-blue-600">
            <svg class="w-8 h-8 mx-auto mb-2 text-gray-600 dark:text-d-blue-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span class="text-sm font-medium">SVG</span>
          </button>
          <button @click="exportSchema('pdf')" class="export-btn p-3 text-center border border-gray-300 dark:border-d-blue-500 rounded-lg hover:bg-gray-50 dark:hover:bg-d-blue-600">
            <svg class="w-8 h-8 mx-auto mb-2 text-gray-600 dark:text-d-blue-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span class="text-sm font-medium">PDF</span>
          </button>
        </div>
        <div class="mt-4 flex justify-end">
          <button @click="closeExportModal" class="px-4 py-2 text-gray-600 dark:text-d-blue-100 hover:text-gray-800 dark:hover:text-white">إلغاء</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import KitButton from "@/components/KitButton.vue";
import LoadingIcon from "@/components/icons/LoadingIcon.vue";
import { mapState } from "vuex";

export default {
  name: "SchemaVisualizer",
  components: { KitButton, LoadingIcon },
  data() {
    return {
      loading: false,
      tables: [],
      showExportModal: false
    };
  },
  computed: {
    ...mapState(["project", "dir"]),
    hasSchema() {
      return this.tables && this.tables.length > 0;
    }
  },
  methods: {
    async refreshSchema() {
      if (!this.dir) return;
      
      this.loading = true;
      try {
        // Mock schema data for demonstration - in a real implementation,
        // this would call the Laravel project's database to get schema info
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate loading
        
        this.tables = [
          {
            name: 'users',
            columns: [
              { name: 'id', type: 'bigint', primary: true, nullable: false, unique: false },
              { name: 'name', type: 'varchar(255)', primary: false, nullable: false, unique: false },
              { name: 'email', type: 'varchar(255)', primary: false, nullable: false, unique: true },
              { name: 'email_verified_at', type: 'timestamp', primary: false, nullable: true, unique: false },
              { name: 'password', type: 'varchar(255)', primary: false, nullable: false, unique: false },
              { name: 'created_at', type: 'timestamp', primary: false, nullable: true, unique: false },
              { name: 'updated_at', type: 'timestamp', primary: false, nullable: true, unique: false }
            ],
            relationships: []
          },
          {
            name: 'posts',
            columns: [
              { name: 'id', type: 'bigint', primary: true, nullable: false, unique: false },
              { name: 'user_id', type: 'bigint', primary: false, nullable: false, unique: false },
              { name: 'title', type: 'varchar(255)', primary: false, nullable: false, unique: false },
              { name: 'content', type: 'text', primary: false, nullable: true, unique: false },
              { name: 'published_at', type: 'timestamp', primary: false, nullable: true, unique: false },
              { name: 'created_at', type: 'timestamp', primary: false, nullable: true, unique: false },
              { name: 'updated_at', type: 'timestamp', primary: false, nullable: true, unique: false }
            ],
            relationships: [
              { column: 'user_id', references_table: 'users', references_column: 'id' }
            ]
          },
          {
            name: 'categories',
            columns: [
              { name: 'id', type: 'bigint', primary: true, nullable: false, unique: false },
              { name: 'name', type: 'varchar(255)', primary: false, nullable: false, unique: true },
              { name: 'slug', type: 'varchar(255)', primary: false, nullable: false, unique: true },
              { name: 'created_at', type: 'timestamp', primary: false, nullable: true, unique: false },
              { name: 'updated_at', type: 'timestamp', primary: false, nullable: true, unique: false }
            ],
            relationships: []
          }
        ];
      } catch (error) {
        console.error('Error loading schema:', error);
        // Handle error appropriately
      } finally {
        this.loading = false;
      }
    },
    
    showExportOptions() {
      this.showExportModal = true;
    },
    
    closeExportModal() {
      this.showExportModal = false;
    },
    
    async exportSchema(format) {
      // Mock export functionality - in a real implementation,
      // this would capture the schema visualization and export it
      console.log(`Exporting schema as ${format}`);
      
      // For now, just show a success message
      alert(`تم تصدير مخطط قاعدة البيانات كملف ${format.toUpperCase()}`);
      this.closeExportModal();
    }
  },
  
  mounted() {
    // Auto-load schema if project is already open
    if (this.dir) {
      this.refreshSchema();
    }
  }
};
</script>

<style scoped>
.table-card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.table-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.export-btn {
  transition: all 0.2s;
}

.export-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>