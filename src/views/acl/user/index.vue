<template>
  <el-card>
    <el-form class="form" inline>
      <el-form-item label="用户名">
        <el-input v-model="keyword" placeholder="输入用户名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">搜索</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin: 10px 0">
    <el-button type="primary" size="default" @click="addUser">添加用户</el-button>
    <el-button :disabled="!selectIdArr.length" type="danger" size="default" @click="deleteSelectUser">批量删除</el-button>
    <!-- 表格 -->
    <el-table :data="userArr" border style="margin: 10px 0" @selection-change="selectChange">
      <el-table-column align="center" type="selection" width="50" />
      <el-table-column align="center" label="#" type="index" width="50" />
      <el-table-column align="center" prop="id" label="ID"> </el-table-column>
      <el-table-column align="center" prop="username" label="用户名字" show-overflow-tooltip> </el-table-column>
      <el-table-column align="center" prop="name" label="用户名称" show-overflow-tooltip> </el-table-column>
      <el-table-column align="center" prop="roleName" label="用户角色" show-overflow-tooltip> </el-table-column>
      <el-table-column align="center" prop="createTime" label="创建时间" show-overflow-tooltip> </el-table-column>
      <el-table-column align="center" prop="updateTime" label="更新时间" show-overflow-tooltip> </el-table-column>
      <el-table-column align="center" prop="" label="操作" width="300">
        <template #default="{ row }">
          <el-button type="primary" size="small" icon="User" @click="setRole(row)">分配角色</el-button>
          <el-button type="primary" size="small" icon="Edit" @click="updateUser(row)">编辑</el-button>
          <el-popconfirm title="确认要删除吗？" @confirm="deleteUser(row.id)">
            <template #reference>
              <el-button type="danger" size="small" icon="Delete">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChange"
      @current-change="getHasUser"
      v-model:currentPage="pageNo"
      :page-sizes="[5, 7, 9, 11]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      background
    >
    </el-pagination>
  </el-card>
  <!-- 抽屉组件 -->
  <el-drawer v-model="drawer">
    <template #header>
      <h4>{{ userParams.id ? '更新用户' : '添加用户' }}</h4>
    </template>
    <template #default>
      <el-form :model="userParams" ref="formRef" :rules="rules">
        <el-form-item label="用户姓名" prop="username">
          <el-input v-model="userParams.username" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="用户昵称" prop="name">
          <el-input v-model="userParams.name" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item v-if="!userParams.id" label="用户密码" prop="password">
          <el-input v-model="userParams.password" placeholder="请输入"></el-input>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </div>
    </template>
  </el-drawer>
  <!-- 分配角色抽屉 -->
  <el-drawer v-model="drawer1">
    <template #header>
      <h4>分配角色</h4>
    </template>
    <template #default>
      <el-form>
        <el-form-item label="用户姓名">
          <el-input v-model="userParams.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="职位列表">
          <el-checkbox v-model="checkAll" @change="handleCheckAll">全选</el-checkbox>
          <el-checkbox-group v-model="userRole" @change="handleCheckedChange">
            <el-checkbox v-for="(role, index) in allRole" :key="index" :value="role">
              {{ role.roleName }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="drawer1 = false">取消</el-button>
        <el-button type="primary" @click="confirmClick">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { nextTick, onMounted, reactive, ref } from 'vue';
import {
  reqUserInfo,
  reqAddOrUpdateUser,
  reqAllRole,
  reqSetUserRole,
  reqRemoveUser,
  reqSelectUser,
} from '@/api/acl/user/index';
import type { UserResponseData, Records, User, AllRoleResponseData, AllRole, SetRoleData } from '@/api/acl/user/type';
import { ElMessage } from 'element-plus';
import useLayoutSetting from '@/store/modules/setting';

const settingStore = useLayoutSetting();
const pageNo = ref<number>(1);
const pageSize = ref<number>(5);
const total = ref<number>(0);
const userArr = ref<Records>([]);
const userParams = reactive<User>({
  username: '',
  name: '',
  password: '',
});

const keyword = ref<string>('');

const validatorUsername = (__rule: any, value: any, callback: any) => {
  if (value.trim().length >= 5) {
    callback();
  } else {
    callback(new Error('长度至少为5位'));
  }
};
const validatorName = (__rule: any, value: any, callback: any) => {
  if (value.trim().length >= 5) {
    callback();
  } else {
    callback(new Error('长度至少为5位'));
  }
};
const validatorPassword = (__rule: any, value: any, callback: any) => {
  if (value.trim().length >= 6) {
    callback();
  } else {
    callback(new Error('长度至少为6位'));
  }
};
const rules = {
  username: [{ required: true, trigger: 'blur', validator: validatorUsername }],
  name: [{ required: true, trigger: 'blur', validator: validatorName }],
  password: [{ required: true, trigger: 'blur', validator: validatorPassword }],
};

const sizeChange = (val: number) => {
  pageSize.value = val;
  getHasUser();
};

const getHasUser = async (pager = 1) => {
  pageNo.value = pager;
  const result: UserResponseData = await reqUserInfo(pageNo.value, pageSize.value, keyword.value);
  if (result.code === 200) {
    userArr.value = result.data.records;
    total.value = result.data.total;
  }
};

const drawer = ref<boolean>(false);

const addUser = () => {
  drawer.value = true;
  Object.assign(userParams, {
    id: 0,
    username: '',
    name: '',
    password: '',
  });
  nextTick(() => {
    formRef.value.resetFields();
  });
};

const updateUser = (row: User) => {
  drawer.value = true;
  // nextTick(() => formRef.value.resetFields());
  Object.assign(userParams, JSON.parse(JSON.stringify(row)));
};

const formRef = ref<any>(null);
const save = async () => {
  await formRef.value.validate();
  const result: any = await reqAddOrUpdateUser(userParams);
  if (result.code === 200) {
    ElMessage.success('操作成功');
    drawer.value = false;
    getHasUser();
    window.location.reload();
  } else {
    ElMessage.error('操作失败');
  }
};

const cancel = () => {
  drawer.value = false;
};

const drawer1 = ref<boolean>(false);
const allRole = ref<AllRole>([]);
const userRole = ref<AllRole>([]);

const setRole = async (row: User) => {
  Object.assign(userParams, JSON.parse(JSON.stringify(row)));

  // 获取全部职位数据以及当前已有职位数据
  const result: AllRoleResponseData = await reqAllRole(userParams.id as number);
  if (result.code === 200) {
    allRole.value = result.data.allRolesList;
    userRole.value = result.data.assignRoles;
    drawer1.value = true;
  }
};

const checkAll = ref<boolean>(false);

const handleCheckAll = (value: boolean) => {
  userRole.value = value ? allRole.value : [];
};

const handleCheckedChange = (value: string[]) => {
  const checkdCount = value.length;
  checkAll.value = checkdCount === allRole.value.length;
};

const confirmClick = async () => {
  const data: SetRoleData = {
    userId: userParams.id as number,
    roleIdList: userRole.value.map(t => t.id as number),
  };
  const result: any = await reqSetUserRole(data);
  if (result.code === 200) {
    drawer1.value = false;
    ElMessage.success('操作成功');
    getHasUser();
  } else {
    ElMessage.error('操作失败');
  }
};

const deleteUser = async (id: number) => {
  const result: any = await reqRemoveUser(id);
  if (result.code === 200) {
    ElMessage.success('操作成功');
    getHasUser();
  }
};

const selectIdArr = ref<User[]>([]);

// table复选框
const selectChange = (value: any) => {
  console.log('value', value);
  selectIdArr.value = value;
};

const deleteSelectUser = async () => {
  const idsList: any = selectIdArr.value.map(t => t.id);
  const result: any = await reqSelectUser(idsList);
  if (result.code === 200) {
    ElMessage.success('删除成功');
    getHasUser();
  } else {
    ElMessage.error('删除失败');
  }
};

const search = () => {
  getHasUser();
};

const reset = () => {
  settingStore.refresh = !settingStore.refresh;
};

onMounted(() => {
  getHasUser();
});
</script>

<style lang="scss" scoped>
.form {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .el-form-item {
    margin-bottom: 0;
  }
}
</style>
