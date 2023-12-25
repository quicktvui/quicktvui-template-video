<template>
  <qt-grid-view class="grid-view" ref="gridViewRef" :clipChildren="false" :clipPadding="false"
    @item-click="onListItemClick" :spanCount="4" :areaWidth="style.width" :enablePlaceholder="true" :style="{ style }"
    name="grid-view">
    <qt-poster />
  </qt-grid-view>
</template>

<script lang="ts">
import { QTGridView, QTListViewItem, QTWaterfallItem } from '@quicktvui/quicktvui3';
import { computed, defineComponent, inject, ref } from 'vue';
import { ProListPageProps } from './ProListPage.vue';

export type FilterDataSource = (QTListViewItem & Record<'label' | 'value', string | number> & { type: 89901; filterVisible: boolean; })[][];

export type ListDataSource = QTWaterfallItem[];

export default defineComponent({
  setup(props, { emit }) {
    const gridViewRef = ref<QTGridView>();

    const hasSider = inject<ProListPageProps["hasSider"]>("hasSider");

    const hasHeader = inject<ProListPageProps["hasHeader"]>("hasHeader");

    const style = computed(() => ({
      width: hasSider ? 1920 - 340 : 1920,
      height: hasHeader ? 1080 - 100 : 1080
    }));

    const filterDataSource = ref<FilterDataSource>([]);

    const onListItemClick = (...rest) => {
      emit('onListItemClick', ...rest)
    }

    return {
      gridViewRef,
      style,
      filterDataSource,
      onListItemClick,
    }
  }
})
</script>

<style scoped>
.grid-view {
  background-color: transparent;
}
</style>
