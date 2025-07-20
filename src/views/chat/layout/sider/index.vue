<script setup lang='ts'>
import type { CSSProperties } from 'vue'
import { computed, ref, watch, onMounted } from 'vue'
import { NButton, NLayoutSider, useDialog, NSelect } from 'naive-ui'
import List from './List.vue'
import Footer from './Footer.vue'
import { useAppStore, useChatStore, useModelStore } from '@/store'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { PromptStore, SvgIcon } from '@/components/common'
import { t } from '@/locales'
import { storeToRefs } from 'pinia'


const appStore = useAppStore()  
const chatStore = useChatStore()

const dialog = useDialog()

const { isMobile } = useBasicLayout()
const show = ref(false)
const modelStore = useModelStore()

const { modelList } = storeToRefs(modelStore)
// const selectedProvider = ref<string | null>(null)


const collapsed = computed(() => appStore.siderCollapsed)

function handleAdd() {
  chatStore.addHistory({ title: t('chat.newChatTitle'), uuid: Date.now(), isEdit: false })
  if (isMobile.value)
    appStore.setSiderCollapsed(true)
}

function handleUpdateCollapsed() {
  appStore.setSiderCollapsed(!collapsed.value)
}

function handleClearAll() {
  dialog.warning({
    title: t('chat.deleteMessage'),
    content: t('chat.clearHistoryConfirm'),
    positiveText: t('common.yes'),
    negativeText: t('common.no'),
    onPositiveClick: () => {
      chatStore.clearHistory()
      if (isMobile.value)
        appStore.setSiderCollapsed(true)
    },
  })
}

// 页面刷新时初始化
onMounted(async () => {
  await modelStore.initModelList()
  //console.log('123', modelList.value)
})

const options = computed(() =>
  modelStore.modelList.map(item => ({
      label: `${item.model}`,
      value: item.provider,
    }))
)

// 监听选中项变化（可选）
function handleChange(value: string) {
  //console.log('选中 provider:', value)
  const model = modelStore.modelList.find(item => item.provider === value)
  if (model)
    modelStore.setSelected(model)
}

const getMobileClass = computed<CSSProperties>(() => {
  if (isMobile.value) {
    return {
      position: 'fixed',
      zIndex: 50,
    }
  }
  return {}
})

const mobileSafeArea = computed(() => {
  if (isMobile.value) {
    return {
      paddingBottom: 'env(safe-area-inset-bottom)',
    }
  }
  return {}
})

watch(
  isMobile,
  (val) => {
    appStore.setSiderCollapsed(val)
  },
  {
    immediate: true,
    flush: 'post',
  },
)

</script>
<style>
.custom-select .n-base-selection-input__content {
  color: #B75FFF !important;
}
</style>
<template>
  <NLayoutSider
    :collapsed="collapsed"
    :collapsed-width="0"
    :width="260"
    :show-trigger="isMobile ? false : 'arrow-circle'"
    collapse-mode="transform"
    position="absolute"
    bordered
    :style="getMobileClass"
    @update-collapsed="handleUpdateCollapsed"
  >
    <div class="flex flex-col h-full" :style="mobileSafeArea">
      <main class="flex flex-col flex-1 min-h-0">
        <div class="p-4">
          <NButton dashed block @click="handleAdd">
            {{ $t('chat.newChatButton') }}
          </NButton>
        </div>
        <div class="flex-1 min-h-0 pb-4 overflow-hidden">
          <List />
        </div>
        <div class="flex items-center p-4 space-x-4">
          <div class="flex-1">
            <!-- <NButton block @click="show = true">
              {{ $t('store.siderButton') }}
            </NButton> -->
            <NSelect
              :value="modelStore.selectedModel?.provider"
              :options="options"
              labelField="label"
              valueField="value"
              placeholder="请选择模型"
              style="width: 100%; max-width: 170px;"
              class="custom-select"
              @update:value="handleChange"
            >
          </NSelect>
          </div>
          <NButton @click="handleClearAll">
            <SvgIcon icon="ri:close-circle-line" />
          </NButton>
        </div>
      </main>
      <Footer />
    </div>
  </NLayoutSider>
  <template v-if="isMobile">
    <div v-show="!collapsed" class="fixed inset-0 z-40 w-full h-full bg-black/40" @click="handleUpdateCollapsed" />
  </template>
  <PromptStore v-model:visible="show" />
</template>
