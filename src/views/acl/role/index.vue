<template>
  <el-card>
    <el-form inline>
      <el-form-item label="职位搜索">
        <el-input v-model="keyword" placeholder="请输入职位关键字"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">搜索</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>

  <el-card style="margin: 10px 0">
    <el-button type="primary" size="default" icon="Plus" @click="addRole">添加职位</el-button>
    <el-table :data="allRole" border style="margin: 10px 0">
      <el-table-column align="center" label="#" type="index" width="50" />
      <el-table-column align="center" label="ID" prop="id"> </el-table-column>
      <el-table-column align="center" label="职位名称" prop="roleName" show-overflow-tooltip> </el-table-column>
      <el-table-column align="center" label="创建时间" prop="createTime" show-overflow-tooltip> </el-table-column>
      <el-table-column align="center" label="更新时间" prop="updateTime" show-overflow-tooltip> </el-table-column>
      <el-table-column align="center" label="操作" width="280">
        <template #default="{ row }">
          <el-button type="primary" size="small" icon="User" @click="setPermission(row)">分配权限</el-button>
          <el-button type="primary" size="small" icon="Edit" @click="updateRole(row)">编辑</el-button>
          <el-popconfirm title="确认要删除该职位?" @confirm="removeRole(row.id)">
            <template #reference>
              <el-button type="danger" size="small" icon="Delete">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChange"
      @current-change="getHasRole"
      v-model:currentPage="pageNo"
      :page-sizes="[5, 7, 9, 11]"
      v-model:page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      background
    >
    </el-pagination>
  </el-card>
  <!-- 添加职位与更新已有职位弹窗 -->
  <el-dialog v-model="dialogVisible" :title="roleParams.id ? '编辑职位' : '添加职位'">
    <el-form :model="roleParams" ref="formRef" :rules="rules">
      <el-form-item label="职位名称" prop="roleName">
        <el-input v-model="roleParams.roleName" placeholder="输入职位名称"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
  <!-- 抽屉组件，分配用户菜单权限与按钮权限 -->
  <el-drawer v-model="drawer">
    <template #header>
      <h4>分配菜单与按钮的权限</h4>
    </template>
    <template #default>
      <!-- 树形控件 -->
      <el-tree
        ref="treeRef"
        :data="menuArr"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="selectArr"
        :props="defaultProps"
      />
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="drawer = false">取消</el-button>
        <el-button type="primary" @click="handler">确认</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import {
  reqAllRoleList,
  reqAddOrUpdateRole,
  reqAllMenuList,
  reqSetPermission,
  reqRemoveRole,
} from '@/api/acl/role/index';
import type { RoleResponseData, Records, RoleData, MenuResponseData, MenuList } from '@/api/acl/role/type';
import useLayoutSetting from '@/store/modules/setting';
import { ElMessage } from 'element-plus';

const settingStore = useLayoutSetting();
const total = ref<number>(0);
const pageNo = ref<number>(1);
const pageSize = ref<number>(5);
const keyword = ref<string>('');
const allRole = ref<Records>([]);
const dialogVisible = ref<boolean>(false);
const roleParams = reactive<RoleData>({
  roleName: '',
});
const rules = {
  roleName: [{ required: true, message: '请输入职位名称', trigger: 'blur' }],
};
const drawer = ref<boolean>(false);
const defaultProps = {
  children: 'children',
  label: 'name',
};
const menuArr = ref<MenuList>([]);
// 存放默认勾选节点id
const selectArr = ref<number[]>([]);
const sizeChange = () => {
  getHasRole();
};

const getHasRole = async (pager = 1) => {
  pageNo.value = pager;
  const result: RoleResponseData = await reqAllRoleList(pageNo.value, pageSize.value, keyword.value);
  if (result.code === 200) {
    total.value = result.data.total;
    allRole.value = result.data.records;
  }
};

const search = () => {
  getHasRole();
};

const reset = () => {
  settingStore.refresh = !settingStore.refresh;
};

const addRole = () => {
  // 对象合并
  Object.assign(roleParams, {
    roleName: '',
    id: 0,
  });
  dialogVisible.value = true;
};

const updateRole = (row: RoleData) => {
  dialogVisible.value = true;
  Object.assign(roleParams, row);
};

const formRef = ref<any>();
const save = async () => {
  await formRef.value.validate();
  const result = await reqAddOrUpdateRole(roleParams);
  if (result.code === 200) {
    dialogVisible.value = false;
    ElMessage.success('操作成功');
    getHasRole();
  }
};

const setPermission = async (row: RoleData) => {
  drawer.value = true;
  Object.assign(roleParams, row);
  const result: MenuResponseData = await reqAllMenuList(roleParams.id as number);
  if (result.code === 200) {
    menuArr.value = result.data;
    selectArr.value = filterSelectArr(menuArr.value, []);
  }
};

const filterSelectArr = (allData: any, initArr: any) => {
  allData.forEach((item: any) => {
    if (item.select && item.level === 4) {
      initArr.push(item.id);
    }
    if (item.children && item.children.length) {
      filterSelectArr(item.children, initArr);
    }
  });
  return initArr;
};

const treeRef = ref<any>();
const handler = async () => {
  const roleId = roleParams.id as number;
  const arr = treeRef.value.getCheckedKeys();
  console.log('arr', arr);
  // 半选id
  const arr1 = treeRef.value.getHalfCheckedKeys();
  const permissionId = arr.concat(arr1);

  const result: any = await reqSetPermission(roleId, permissionId);
  if (result.code === 200) {
    drawer.value = false;
    ElMessage.success('操作成功');
    window.location.reload();
  }
};

const removeRole = async (id: number) => {
  const result: any = await reqRemoveRole(id);
  if (result.code === 200) {
    ElMessage.success('操作成功');
    getHasRole();
  }
};

onMounted(() => {
  getHasRole();
});
</script>

<style scoped></style>
