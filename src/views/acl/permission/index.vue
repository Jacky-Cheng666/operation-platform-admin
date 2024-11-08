<template>
  <div>
    <el-table :data="permissionArr" style="width: 100%; margin-bottom: 20px" row-key="id" border>
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="code" label="权限值" />
      <el-table-column prop="updateTime" label="修改时间" />
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button v-if="row.level !== 4" type="primary" size="small" icon="Plus" @click="addPermission(row)">{{
            row.level === 3 ? '添加功能' : '添加菜单'
          }}</el-button>
          <el-button v-if="row.level !== 1" type="primary" size="small" icon="Edit" @click="updatePermission(row)"
            >编辑</el-button
          >
          <el-popconfirm title="确认要删除该菜单?" width="260" @confirm="removeMenu(row.id)">
            <template #reference>
              <el-button v-if="row.level !== 1" type="danger" size="small" icon="Delete">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加/修改菜单弹窗 -->
    <el-dialog title="添加菜单" v-model="dialogVisible">
      <el-form ref="form">
        <el-form-item label="名称">
          <el-input v-model="menuData.name" placeholder="请输入菜单名称"></el-input>
        </el-form-item>
        <el-form-item label="权限">
          <el-input v-model="menuData.code" placeholder="请输入权限代码"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span>
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="save">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { reqAllPermission, reqAddOrUpdateMenu, reqRemoveMenu } from '@/api/acl/menu/index';
import type { PermissionResponseData, PermissionList, Permission, MenuParams } from '@/api/acl/menu/type';
import { ElMessage } from 'element-plus';

const permissionArr = ref<PermissionList>([]);
const dialogVisible = ref<boolean>(false);
const menuData = reactive<MenuParams>({
  code: '',
  level: 0,
  name: '',
  pid: 0,
});

const getHasPermission = async () => {
  const result: PermissionResponseData = await reqAllPermission();
  if (result.code === 200) {
    permissionArr.value = result.data;
  }
};

const addPermission = (row: Permission) => {
  Object.assign(menuData, {
    id: 0,
    code: '',
    level: 0,
    name: '',
    pid: 0,
  });
  menuData.level = row.level + 1;
  menuData.pid = row.id as number;
  dialogVisible.value = true;
};

const updatePermission = (row: Permission) => {
  dialogVisible.value = true;
  Object.assign(menuData, row);
};

const save = async () => {
  const result: any = await reqAddOrUpdateMenu(menuData);
  if (result.code === 200) {
    ElMessage.success('操作成功');
    dialogVisible.value = false;
    getHasPermission();
  }
};

const removeMenu = async (id: number) => {
  const result: any = await reqRemoveMenu(id);
  if (result.code === 200) {
    ElMessage.success('操作成功');
    getHasPermission();
  }
};

onMounted(() => {
  getHasPermission();
});
</script>

<style scoped></style>
