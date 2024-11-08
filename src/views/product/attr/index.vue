<template>
  <div>
    <Category :scene="scene" />
    <el-card style="margin: 10px 0">
      <div v-show="scene === 0">
        <el-button type="primary" size="default" icon="Plus" :disabled="!categoryStore.c3Id" @click="addAttr"
          >添加属性</el-button
        >
        <el-table :data="attrArr" border style="margin: 10px 0">
          <el-table-column align="center" type="index" label="序号" width="80" />
          <el-table-column align="center" prop="attrName" label="属性名称" width="120"> </el-table-column>
          <el-table-column align="center" prop="" label="属性值名称">
            <template #default="{ row }">
              <el-tag v-for="item in row.attrValueList" :key="item.id" style="margin-right: 5px; margin-bottom: 5px">{{
                item.valueName
              }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="" label="操作" width="120">
            <template #default="{ row }">
              <el-button type="primary" size="small" icon="Edit" @click="updateAttr(row)"></el-button>
              <el-popconfirm title="确定要删除该属性吗？" @confirm="deleteAttr(row.id)">
                <template #reference>
                  <el-button type="danger" size="small" icon="Delete"></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="scene === 1">
        <el-form :model="attrParams" ref="formRef" label-width="80px" inline>
          <el-form-item label="属性名称">
            <el-input placeholder="请输入属性名称" v-model="attrParams.attrName"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="Plus" :disabled="!attrParams.attrName" @click="addAttrValue"
              >添加属性值</el-button
            >
            <el-button type="primary" @click="cancel">取消</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="attrParams.attrValueList" border style="margin: 10px 0">
          <el-table-column label="序号" type="index" width="80px" align="center" />
          <el-table-column label="属性值名称">
            <template #default="{ row, $index }">
              <el-input
                v-if="row.flag"
                :ref="(vc: any) => (inputArr[$index] = vc)"
                v-model="row.valueName"
                size="small"
                placeholder="请输入属性值名称"
                @blur="toLock(row, $index)"
              />
              <div v-else @click="toEdit(row, $index)">{{ row.valueName }}</div>
            </template>
          </el-table-column>
          <el-table-column label="属性值操作">
            <template #default="{ $index }">
              <el-button type="danger" size="small" icon="Delete" @click="onDelete($index)"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button :disabled="!attrParams.attrValueList.length" type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import useCategoryStore from '@/store/modules/category';
import { watch, ref, reactive, nextTick, onBeforeUnmount } from 'vue';
import { reqAttr, reqAddOrUpdateAttr, reqRemoveAttr } from '@/api/product/attr/index';
import { storeToRefs } from 'pinia';
import type { AttrResponseData, Attr, AttrValue } from '@/api/product/attr/type';
import { ElMessage } from 'element-plus';

const categoryStore = useCategoryStore();

watch(
  () => categoryStore.c3Id,
  () => {
    getAttr();
  },
);

const attrArr = ref<Attr[]>([]);
const getAttr = async () => {
  const { c1Id, c2Id, c3Id } = storeToRefs(categoryStore);
  attrArr.value = [];
  if (!c3Id.value) return;
  const result: AttrResponseData = await reqAttr(c1Id.value, c2Id.value, c3Id.value);
  if (result.code === 200) {
    attrArr.value = result.data;
  }
};

const scene = ref<number>(0);
const addAttr = () => {
  // 初始化数据
  Object.assign(attrParams, {
    attrName: '',
    attrValueList: [],
    categoryId: categoryStore.c3Id,
    categoryLevel: 3,
  });
  scene.value = 1;
};

const updateAttr = (row: Attr) => {
  scene.value = 1;
  // 赋值操作
  Object.assign(attrParams, JSON.parse(JSON.stringify(row)));
};

const cancel = () => {
  scene.value = 0;
};

const attrParams = reactive<Attr>({
  attrName: '',
  attrValueList: [],
  categoryId: '',
  categoryLevel: 3,
});

const addAttrValue = () => {
  attrParams.attrValueList.push({
    valueName: '',
    flag: true,
  });
  nextTick(() => inputArr.value[attrParams.attrValueList.length - 1].focus());
};

const save = async () => {
  const result: any = await reqAddOrUpdateAttr(attrParams);
  if (result.code === 200) {
    scene.value = 0;
    ElMessage.success('操作成功');
    // 重新刷新表格
    getAttr();
  } else {
    ElMessage.error('操作失败');
  }
};

const toLock = (row: AttrValue, index: number) => {
  const rowInput = row.valueName.trim();
  if (rowInput) {
    const hasRepeat = attrParams.attrValueList.some(t => {
      if (t !== row) {
        return t.valueName === rowInput;
      }
    });
    if (hasRepeat) {
      attrParams.attrValueList.splice(index, 1);
      return ElMessage.warning('属性值不能重复');
    }
    row.flag = false;
  } else {
    ElMessage.warning('属性值不能为空');
    attrParams.attrValueList.splice(index, 1);
  }
};
const toEdit = (row: AttrValue, index: number) => {
  row.flag = true;
  nextTick(() => inputArr.value[index].focus());
  // nextTick：响应式数据发生变化，获取更新后的DOM（组件实例）
};

const inputArr = ref<any>([]);

const onDelete = (index: number) => {
  attrParams.attrValueList.splice(index, 1);
};

const deleteAttr = async (id: number) => {
  const result = await reqRemoveAttr(id);
  if (result.code === 200) {
    ElMessage.success('操作成功');
    getAttr();
  } else {
    ElMessage.error('操作失败');
  }
};

onBeforeUnmount(() => {
  // 清空仓库数据
  categoryStore.$reset();
});
</script>

<style scoped></style>
