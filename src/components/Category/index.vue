<template>
  <el-card>
    <el-form :model="form" ref="formRef" :inline="true">
      <el-form-item label="一级分类">
        <el-select
          v-model="categoryStore.c1Id"
          :disabled="scene === 1"
          placeholder="请选择"
          style="width: 120px"
          @change="handler"
        >
          <el-option :label="c1.name" :value="c1.id" v-for="c1 in categoryStore.c1Arr" :key="c1.id"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          v-model="categoryStore.c2Id"
          :disabled="scene === 1"
          placeholder="请选择"
          style="width: 120px"
          @change="handler2"
        >
          <el-option :label="c2.name" :value="c2.id" v-for="c2 in categoryStore.c2Arr" :key="c2.id"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select v-model="categoryStore.c3Id" :disabled="scene === 1" placeholder="请选择" style="width: 120px">
          <el-option :label="c3.name" :value="c3.id" v-for="c3 in categoryStore.c3Arr" :key="c3.id"> </el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import useCategoryStore from '@/store/modules/category';

defineProps({
  scene: Number,
});

const categoryStore = useCategoryStore();
const form = reactive({});

const getC1 = () => {
  categoryStore.getC1();
};

const handler = () => {
  categoryStore.c2Id = '';
  categoryStore.c3Id = '';
  categoryStore.c3Arr = [];
  // 通知仓库获取二级数据
  categoryStore.getC2();
};

const handler2 = () => {
  categoryStore.c3Id = '';
  categoryStore.getC3();
};

onMounted(() => {
  getC1();
});
</script>

<style scoped></style>
