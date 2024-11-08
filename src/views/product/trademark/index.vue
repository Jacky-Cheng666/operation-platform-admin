<template>
  <div>
    <el-card>
      <el-button type="primary" size="default" icon="Plus" @click="addTrademark" v-has="'btn.Trademark.add'"
        >添加品牌</el-button
      >
      <el-table :data="trademarkArr" border style="margin: 10px 0">
        <el-table-column type="index" label="序号" width="80px" align="center" />
        <el-table-column prop="tmName" label="品牌名称" />
        <el-table-column label="品牌LOGO">
          <template #default="{ row }">
            <img
              :src="row.logoUrl.includes('http') ? row.logoUrl : 'http://' + row.logoUrl"
              alt="未找到图片"
              style="width: 100px"
            />
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间"> </el-table-column>

        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button type="warning" size="small" icon="Edit" @click="updateTrademark(row)" />
            <el-popconfirm title="确定要删除吗?" @confirm="removeTradeMark(row.id)">
              <template #reference>
                <el-button type="danger" size="small" icon="Delete" />
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:current-page="pageNo"
        v-model:page-size="limit"
        :page-sizes="[3, 5, 7, 9]"
        background
        layout=" prev, pager, next, jumper, total, ->, sizes"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>
    <el-dialog :title="trademarkParams.id ? '修改品牌' : '添加品牌'" v-model="dialogFormVisible">
      <el-form
        ref="formRef"
        :model="trademarkParams"
        label-width="100px"
        :inline="false"
        :rules="rules"
        style="width: 80%"
      >
        <el-form-item label="品牌名称" prop="tmName">
          <el-input v-model.trim="trademarkParams.tmName" placeholder="请输入品牌名称"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            action="/api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="trademarkParams.logoUrl" :src="trademarkParams.logoUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>

      <template #footer>
        <span>
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="confirm">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, nextTick } from 'vue';
import { reqHasTrademark, reqAddOrUpdateTrademark, reqDeleteTrademark } from '@/api/product/trademark/index';
import type { Records, TradeMarkResponseData, TradeMark } from '@/api/product/trademark/type';
import type { UploadProps } from 'element-plus';
import { ElMessage } from 'element-plus';

const pageNo = ref<number>(1);
const limit = ref<number>(3);
const total = ref<number>(0);
const trademarkArr = ref<Records>([]);
const dialogFormVisible = ref(false);
const trademarkParams = reactive<TradeMark>({
  tmName: '',
  logoUrl: '',
});
const formRef = ref();

const getTableRows = async (page = 1) => {
  pageNo.value = page;
  const result: TradeMarkResponseData = await reqHasTrademark(pageNo.value, limit.value);
  if (result.code === 200) {
    total.value = result.data.total;
    trademarkArr.value = result.data.records;
  }
};

const handleSizeChange = () => {
  getTableRows();
};
const handleCurrentChange = (page: number) => {
  getTableRows(page);
};

const addTrademark = () => {
  // 清空数据
  trademarkParams.id = 0;
  trademarkParams.tmName = '';
  trademarkParams.logoUrl = '';
  dialogFormVisible.value = true;
  nextTick(() => {
    formRef.value.resetFields();
  });
};

const updateTrademark = (row: TradeMark) => {
  Object.assign(trademarkParams, row);
  dialogFormVisible.value = true;
};

const cancel = () => {
  dialogFormVisible.value = false;
};

const confirm = async () => {
  // 表单校验
  await formRef.value.validate();

  const result: any = await reqAddOrUpdateTrademark(trademarkParams);
  if (result.code === 200) {
    ElMessage.success('操作成功');
    dialogFormVisible.value = false;
    getTableRows();
  } else {
    ElMessage.error('添加失败');
  }
};

const beforeAvatarUpload: UploadProps['beforeUpload'] = rawFile => {
  if (!['image/jpeg', 'image/png'].includes(rawFile.type)) {
    ElMessage.error('仅支持上传图片格式!');
    return false;
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('图片最大为2MB!');
    return false;
  }
  return true;
};

const handleAvatarSuccess: UploadProps['onSuccess'] = response => {
  trademarkParams.logoUrl = response.data;
};

const checkTmName = (_rule: any, value: any, callback: any) => {
  if (value.trim().length >= 2) {
    callback();
  } else {
    callback(new Error('品牌名称长度不少于两位'));
  }
};

const checkLogo = (_rule: any, value: any, callback: any) => {
  if (!value) {
    callback(new Error('请上传文件'));
  } else {
    callback();
  }
};

const rules = {
  tmName: [{ required: true, trigger: 'blur', validator: checkTmName }],
  logoUrl: [{ required: true, trigger: 'change', validator: checkLogo }],
};

const removeTradeMark = async (id: number) => {
  const result = await reqDeleteTrademark(id);
  if (result.code === 200) {
    ElMessage.success('删除成功');
    getTableRows();
  } else {
    ElMessage.error('删除失败');
  }
};

onMounted(() => {
  getTableRows();
});
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
