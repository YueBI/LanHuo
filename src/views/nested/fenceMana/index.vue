<template>
  <div style="height:100%;">
    <div class="header-title" />
    <!--数据筛选条件+按钮-->
    <el-row class="subjectMana filterForm" :style="{width: tableWidth + 'px'}">
      <el-form ref="filterForm" v-model="filterForm" :inline="true">
        <el-form-item label="查询条件">
          <el-select v-model="filterForm.queryCondition" style="width:240px" filterable placeholder="无查询条件">
            <el-option v-for="item in options" :key="item.key" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="查询内容：">
          <el-input v-model.trim="filterForm.queryContent" clearable style="width:220px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="" @click="getFenceFro()">查询</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <!--表格数据-->
    <el-row style="margin-top:10px">
      <el-table
        v-loading="loading"
        :element-loading-text="loadingText"
        element-loading-spinner="el-icon-loading"
        :data="filterFormFro.tableData"
        :border="true"
        :row-class-name="tableRowClassName"
        :header-cell-class-name="tableHeaderClassName"
        tooltip-effect="dark"
        :style="{width: tableWidth + 'px'}"
      >
        <el-table-column prop="index" label="序号" sortable min-width="50%" />
        <el-table-column prop="fenceId" label="围栏编号" min-width="50%" />
        <el-table-column prop="fenceName" label="围栏名称" min-width="60%" />
        <el-table-column prop="mapType" label="地图类型" min-width="60%" />
        <el-table-column prop="mapName" label="地图名称" min-width="60%" />
        <el-table-column prop="adminId" label="创建者" min-width="60%" />
        <el-table-column prop="createTime" label="创建时间" min-width="60%" />
        <el-table-column prop="isActive" label="激活状态" min-width="60%" />
        <el-table-column prop="groupName" label="所属组" min-width="60%" />
        <el-table-column prop="effectiveTime" label="生效时间" min-width="60%" />
        <el-table-column prop="alarmName" label="报警行为" min-width="60%" />
        <el-table-column prop="conditionName" label="触发条件" min-width="60%" />
        <el-table-column label="管理" width="100">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-setting"
              @click="handleEdit(scope.$index, scope.row)"
            />
            <el-button
              size="mini"
              icon="el-icon-delete"
              type="text"
              @click="handleDelete(scope.$index, scope.row)"
            />
            <el-button
              size="mini"
              icon="el-icon-document"
              type="text"
              @click="handleInfo(scope.$index, scope.row)"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <!-- 表格下方分页 -->
    <el-row>
      <div v-show="paginationVisible" class="pagination" style="text-align:center">
        <el-pagination
          background
          :page-size="15"
          :total="filterFormFro.totalCount"
          layout="total, prev, pager, next, jumper"
          :current-page.sync="filterForm.currentPage"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-row>
    <!-- 编辑围栏信息弹窗 -->
    <el-dialog
      title="编辑围栏信息"
      :visible.sync="editVisable"
      :close-on-click-modal="false"
      width="550px"
      class="manaDialog"
      :close-on-press-escape="false"
      @close="resetForm('editForm')"
    >
      <el-form ref="editForm" :model="editForm">
        <el-form-item label="名称：" :label-width="formLabelWidth" prop="fenceName">
          <el-input v-model="editForm.fenceName" style="width:300px" clearable />
        </el-form-item>
        <el-form-item label="描述：" :label-width="formLabelWidth" prop="fenceDes">
          <el-input v-model="editForm.fenceDes" style="width:300px" clearable />
        </el-form-item>
        <el-form-item label="用户组：" :label-width="formLabelWidth" prop="groupName">
          <el-select v-model="editForm.groupName" style="width:240px" filterable placeholder="请输入用户组">
            <el-option v-for="item in options" :key="item.groupName" :label="item.groupName" :value="item.groupName" />
          </el-select>
        </el-form-item>
        <el-form-item label="触发条件：" :label-width="formLabelWidth" prop="conditionName">
          <el-select v-model="editForm.conditionName" style="width:240px" filterable placeholder="请输入触发条件">
            <el-option v-for="item in options" :key="item.conditionName" :label="item.conditionName" :value="item.conditionName" />
          </el-select>
        </el-form-item>
        <el-form-item label="报警方式：" :label-width="formLabelWidth" prop="alarmName">
          <el-select v-model="editForm.alarmName" style="width:240px" filterable placeholder="请输入报警方式">
            <el-option v-for="item in options" :key="item.alarmName" :label="item.alarmName" :value="item.alarmName" />
          </el-select>
        </el-form-item>
        <el-form-item label="生效时间：" :label-width="formLabelWidth" prop="effectiveTime">
          <el-date-picker
            v-model="editForm.effectiveTime"
            type="datetime"
            placeholder="选择日期时间"
            align="right"
            :picker-options="pickerOptions"
          />
        </el-form-item>
        <el-form-item label="管理员：" :label-width="formLabelWidth" prop="adminName">
          <el-input v-model="editForm.adminName" style="width:300px" clearable />
        </el-form-item>
        <el-form-item label="" :label-width="formLabelWidth">
          <el-button style="width:240px" type="primary" @click="submitEdit()">保 存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import api from '@/api/hardware/api.js'
// import '../../static/css/gateMana/common.css'
// import '../../static/css/gateMana/dianziweilan.css'
export default {
  data() {
    return {
      testData: [],
      filterFormFro: {
        tableData: [],
        totalCount: 0
      },
      filterForm: {
        queryCondition: '0',
        queryContent: '',
        currentPage: 1
      },
      tableWidth: '', // 表格宽度
      loadingText: '正在拼命加载中，请稍等......',
      loading: false,
      paginationVisible: true, // 表格下方的分页显示
      formLabelWidth: '150px',
      editVisable: false,
      editForm: {
        fenceName: '',
        fenceDes: '',
        groupName: '',
        conditionName: '',
        alarmName: '',
        effectiveTime: '',
        adminName: ''
      },
      deleteForm: {
        fenceId: ''
      },
      states: [],
      conditionOptions: [],
      alarmOptions: [],
      options: [{
        value: '0',
        label: '无查询条件'
      }, {
        value: '1',
        label: '所属楼名称'
      }, {
        value: '2',
        label: '所属组名称'
      }],
      withCredentials: true,
      processing: false,
      uploadTip: '点击上传',
      importFlag: 1,
      dialogImportVisible: false,
      errorResults: [],
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  created() {
    this.getFenceFro()
  },
  mounted() {
    this.tableWidth = document.body.scrollWidth - 259 - 20
  },
  methods: {
    /** ********************************* 页面处理数据格式等函数 ************************************************ */
    // 点击表格中的“编辑”按钮
    // 分页页面跳转时
    handleCurrentChange(val) {
      this.filterForm.currentPage = val
      this.getFenceFro(this.filterForm.currentPage)
    },
    // 设置表头样式
    tableHeaderClassName({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return 'headerClass'
      }
    },
    // 设置表格每一行样式
    tableRowClassName({ row, rowIndex }) {
      return 'rowClass'
    },
    handleEdit(index, row) {
      const data = this.filterFormFro.tableData[index]
      this.editForm.fenceName = row.fenceName
      this.editForm.oldFenceName = data.fenceName
      this.editForm.fenceDes = row.fenceName
      this.editForm.groupName = row.groupName
      this.editForm.conditionName = row.conditionName
      this.editForm.alarmName = row.alarmName
      this.editForm.effectiveTime = row.effectiveTime
      this.editForm.adminName = row.adminName
      this.editVisable = true
    },
    // 点击表格中的“删除”按钮
    handleDelete(index, row) {
      // let data = this.filterFormFro.tableData[index]
      this.deleteForm.fenceId = row.fenceId
      this.$confirm('确定删除该信息吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteFenceFro()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleInfo(index, row) {
      const data = this.filterFormFro.tableData[index]
      this.$router.push({
        name: 'alarmMana',
        query: {
          fenceId: data.fenceId,
          fenceName: row.fenceName
        }
      })
    },
    // 编辑围栏信息，点击“保存”
    submitEdit() {
      this.$refs['editForm'].validate((valid) => {
        if (valid) {
          this.editFenceFro()
        } else {
          return false
        }
      })
    },
    // 将时间转化为字符串(filterForm)
    formatDayFro(now) {
      var year = now.getFullYear()
      var month = now.getMonth() + 1
      month = month < 10 ? '0' + month : month
      var date = now.getDate()
      date = date < 10 ? ('0' + date) : date
      var hour = now.getHours()
      hour = hour < 10 ? ('0' + hour) : hour
      var minute = now.getMinutes()
      minute = minute < 10 ? ('0' + minute) : minute
      var second = now.getSeconds()
      second = second < 10 ? ('0' + second) : second
      return year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second
    },
    // 触发条件下拉列表
    conditionRemoteMethod(query) {
      if (query !== '') {
        api.getAllCondition({}).then(res => {
          if (res.result === 1000) {
            const data = res.content
            if (data.list.length > 0) {
              this.conditionOptions = data.list
            }
          }
        })
      }
    },
    // 警报下拉列表
    alarmRemoteMethod(query) {
      if (query !== '') {
        api.getAllAlarm({}).then(res => {
          if (res.result === 1000) {
            const data = res.content
            if (data.list.length > 0) {
              this.alarmOptions = data.list
            }
          }
        })
      }
    },
    // 查询信息
    getFenceFro(pageNum) {
      this.loading = true
      const para = {
        pageSize: 15,
        pageNum: parseInt(this.filterForm.currentPage),
        buildName: '学五',
        groupName: ''
      }
      if (this.filterForm.queryCondition !== '0' && this.filterForm.queryContent !== '') {
        if (this.filterForm.queryCondition === '1') {
          para.buildName = this.filterForm.queryContent
        } else {
          para.groupName = this.filterForm.queryContent
        }
      } else {
        para.buildName = ''
        para.groupName = ''
      }
      pageNum ? this.filterForm.currentPage = pageNum : this.filterForm.currentPage = 1
      console.log('Here is para:')
      console.log(para)
      api.getFence(para).then(res => {
        this.filterFormFro.tableData = []
        this.loading = false
        if (res.result === 1000) {
          console.log('Here is res:')
          console.log(res)
          const data = res.content
          data.allPages > 0 ? this.paginationVisible = true : this.paginationVisible = false
          if (data.list.length > 0) {
            // this.filterFormFro.totalCount = data.allCount
            this.filterFormFro.tableData = data.list
            for (let i = 0; i < this.filterFormFro.tableData.length; i++) {
              this.filterFormFro.tableData[i].index = (this.filterForm.currentPage - 1) * 15 + i + 1
            }
            console.log('查到了信息')
          } else {
            this.$message.warning('没有查到任何信息')
            console.log('没有查到任何信息')
          }
        } else {
          console.log('Here comes to non 1000 response')
          this.$message.error(res.resultDesp)
        }
      }).catch(error => {
        console.log('Here comes to error response')
        this.loading = false
        this.$message.error(error)
        console.log(error)
      })
    },
    // 硬件信息-编辑围栏信息
    editFenceFro() {
      const para = {
        fenceName: this.editForm.fenceName,
        oldFenceName: this.editForm.oldFenceName,
        fenceDes: this.editForm.fenceDes,
        groupName: this.editForm.groupName,
        conditionName: this.editForm.conditionName,
        alarmName: this.editForm.alarmName,
        effectiveTime: this.editForm.effectiveTime,
        adminName: this.editForm.adminName
      }
      for (let i = 0; i < this.conditionOptions.length; i++) {
        if (this.editForm.conditionName === this.conditionOptions[i].conditionName) {
          para.conditionId = parseInt(this.conditionOptions[i].conditionId)
          break
        }
      }
      for (let i = 0; i < this.alarmOptions.length; i++) {
        if (this.editForm.conditionName === this.alarmOptions[i].conditionName) {
          para.alarmId = parseInt(this.alarmOptions[i].alarmId)
          break
        }
      }
      api.editFence(para).then(res => {
        if (res.result === 1000) {
          this.editVisable = false
          this.$message.success('编辑围栏信息成功')
          this.getFenceFro()
        } else {
          this.$message.warning(res.resultDesp)
        }
      }).catch(error => {
        this.editVisable = false
        this.$message.error(error)
      })
    },
    // 删除围栏信息
    deleteFenceFro() {
      const para = {
        fenceId: parseInt(this.deleteForm.fenceId)
      }
      api.deleteFence(para).then(res => {
        if (res.result === 1000) {
          this.deleteVisable = false
          this.$message.success('删除成功')
          this.getFenceFro()
        } else {
          this.$message.warning(res.resultDesp)
        }
      }).catch(error => {
        this.deleteVisable = false
        this.$message.error(error)
      })
    }
  }
}
</script>
<style scoped>
.hide-dialog{
  display:none;
}
</style>
