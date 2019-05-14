<template>
   <div style="height:100%;">
      <div class='header-title'>
      </div>
      <!--数据筛选条件+按钮-->
      <el-row class='subjectMana filterForm' v-bind:style="{width: tableWidth + 'px'}">
        <el-form :inline="true" v-model="filterForm" ref="filterForm">
           <el-form-item label="查询条件">
             <el-select style='width:240px' v-model="filterForm.queryCondition"  filterable placeholder="查询内容">
                <el-option v-for="item in options" :key="item.key" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
           </el-form-item>
           <el-form-item label="查询内容：">
            <el-input v-model.trim="filterForm.queryContent" prop="queryContent" clearable style="width:220px"></el-input>
           </el-form-item>
           <el-form-item> 
            <el-button type="primary" @click="getUserGroupFro()" style="">查询</el-button>
           </el-form-item>
          <el-form-item> 
            <!-- <el-button type="primary" @click="getCollegeListFro()" style="">查询</el-button> -->
            <el-button type="primary"  @click="addVisable = true" style="margin-right:15px">添加</el-button>
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
          :header-cell-class-name = "tableHeaderClassName"
          tooltip-effect="dark"
          v-bind:style="{width: tableWidth + 'px'}">
            <el-table-column prop="index" label="序号" sortable width="80px">
            </el-table-column>
            <el-table-column prop="groupId" label="组ID" v-if="false">
            </el-table-column>
            <el-table-column prop="groupName" label="组名称" width="200px">
            </el-table-column>
            <el-table-column prop="description" label="描述"  width="200px">
            </el-table-column>
            <el-table-column v-if="false" prop="adminId" label="组管理员ID" width="200px">
            </el-table-column>
            <el-table-column prop="adminName" label="组管理员" width="200px">
            </el-table-column>
            <el-table-column prop="userNum" label="人数" width="200px">
            </el-table-column>
            <el-table-column prop="fenceNum" label="围栏数" width="200px">
            </el-table-column>
            <el-table-column label="管理" width="150px">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  icon="el-icon-delete"
                  type="text"
                  @click="handleDelete(scope.$index, scope.row)"></el-button>
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-setting"
                  @click="handleEdit(scope.$index, scope.row)"></el-button>
              </template>
          </el-table-column>
        </el-table>
      </el-row>
      <!-- 表格下方分页 -->
      <el-row>
        <div class="pagination" style="text-align:center" v-show="paginationVisible">
            <el-pagination
              @current-change="handleCurrentChange"
              background
              :page-size="15"
              :total="filterFormFro.totalCount"
              layout="total, prev, pager, next, jumper"
              :current-page.sync="filterForm.currentPage">
            </el-pagination>
        </div>
      </el-row>
      <!-- 添加用户组信息弹窗 -->
      <el-dialog title="添加用户组信息"   :visible.sync="addVisable"
          :closeOnClickModal="false" 
          width="550px"
          class="manaDialog"
          :close-on-click-modal="false" 
          :close-on-press-escape="false"
          @close="resetForm('addForm')">
          <el-form :model='addForm' ref="addForm">
            <!--数据筛选条件+按钮-->
            <el-row>
              <el-form :inline="true" v-model="addForm" ref="addForm">
                <el-form-item label="组名称：">
                  <el-input v-model.trim="addForm.groupName" prop="queryCondition" clearable style="width:150px"></el-input>
                </el-form-item>
                <el-form-item label="描述：">
                  <el-input v-model.trim="addForm.description" prop="queryContent" clearable style="width:150px"></el-input>
                </el-form-item>
                <el-form-item label="管理员：">
                  <el-select style='width:240px' v-model="addForm.adminName"  filterable placeholder="请输入管理员姓名" @change="getAdminId('addForm')">
                    <el-option v-for="item in adminOptions" :key="item.adminName" :label="item.adminName" :value="item.adminName">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </el-row>
            <el-row>
              <el-col :span="18">
                <el-table
                    :element-loading-text="loadingText"
                    element-loading-spinner="el-icon-loading"
                    :data="addForm.userData" 
                    :border="true"
                    style="font-size: 12px;text-align: center; color: #333333;"
                    tooltip-effect="dark"
                    v-bind:style="{width:'371px'}">
                    <el-table-column prop="index" label="序号" width="70px">
                    </el-table-column>
                    <el-table-column prop="userId" label="用户ID" width="100px">
                    </el-table-column>
                    <el-table-column prop="userName" label="用户姓名" width="100px">
                    </el-table-column>
                    <el-table-column label="管理" width="100px" align="center">
                        <template slot-scope="scope">
                          <el-button
                            size="mini"
                            icon="el-icon-delete"
                            type="text"
                            style="width: 10px;height: 10px;color:#3FAF98;"
                            @click="handleAddUserDelete(scope.$index, scope.row)"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
              </el-col>
               <el-col :span="1"><div style=""><el-button type="text" size="small" icon="el-icon-plus" @click="handleAddUser('addForm')"></el-button></div></el-col>
               <!-- 表格右侧分页 -->
              <el-col :span="3">
                <div class="userpagination" style="text-align:center" v-show="paginationVisible">
                    <el-pagination
                      @current-change="handleAddUserCurrentChange"
                      background
                      :page-size="15"
                      :total="addForm.totalUserCount"
                      layout="prev, slot, next"
                      :current-page.sync="addForm.currentUserPage">
                    </el-pagination>
                </div>
              </el-col>
            </el-row>
            <el-row style="margin-top:20px">
              <el-col :span="18">
                <el-table
                    :element-loading-text="loadingText"
                    element-loading-spinner="el-icon-loading"
                    :data="addForm.fenceData" 
                    :border="true"
                    style="font-size: 12px;text-align: center; color: #333333;"
                    tooltip-effect="dark"
                    v-bind:style="{width: '371px'}">
                    <el-table-column prop="index" label="序号" width="70px">
                    </el-table-column>
                    <el-table-column prop="fenceName" label="围栏名称" width="100px">
                    </el-table-column>
                    <el-table-column v-if="false" prop="fenceId" label="围栏ID" width="100px">
                    </el-table-column>
                    <el-table-column prop="fenceDes" label="描述"  width="100px">
                    </el-table-column>
                    <el-table-column label="管理" width="100px">
                        <template slot-scope="scope">
                          <el-button
                            size="mini"
                            icon="el-icon-delete"
                            type="text"
                            style="width: 10px;height: 10px;color:#3FAF98;"
                            @click="handleAddFenceDelete(scope.$index, scope.row)"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
              </el-col>
              <el-col :span="1"><div style=""><el-button type="text" size="small" icon="el-icon-plus" @click="handleAddFence('addForm')"></el-button></div></el-col>
              <!-- 表格右侧分页 -->
              <el-col :span="3">
                <div class="userpagination" style="text-align:center" v-show="paginationVisible">
                    <el-pagination
                      @current-change="handleAddFenceCurrentChange"
                      background
                      :page-size="15"
                      :total="addForm.totalFenceCount"
                      layout="prev, slot, next"
                      :current-page.sync="addForm.currentFencePage">
                    </el-pagination>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-form-item >
                <el-button style="width:200px; margin-top:50px; margin-left:150px" type="primary" @click="submitAdd()">保 存</el-button>
              </el-form-item>
            </el-row>
        </el-form>
      </el-dialog>
       <!-- 编辑用户组信息弹窗 -->
      <el-dialog title="编辑用户组信息"   :visible.sync="editVisable"
          :closeOnClickModal="false" 
          width="550px"
          class="manaDialog"
          :close-on-click-modal="false" 
          :close-on-press-escape="false"
          @close="resetForm('editForm')">
          <el-form :model='editForm' ref="editForm">
            <!--数据筛选条件+按钮-->
            <el-row>
              <el-form :inline="true" v-model="editForm" ref="editForm">
                <el-form-item label="组名称：">
                  <el-input v-model.trim="editForm.groupName" prop="queryCondition" clearable style="width:150px"></el-input>
                </el-form-item>
                <el-form-item label="描述：">
                  <el-input v-model.trim="editForm.description" prop="queryContent" clearable style="width:150px"></el-input>
                </el-form-item>
                <el-form-item label="管理员：">
                  <el-select style='width:240px' v-model="editForm.adminName"  filterable placeholder="请输入管理员姓名" @change="getAdminId('editForm')">
                    <el-option v-for="item in adminOptions" :key="item.adminName" :label="item.adminName" :value="item.adminName">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </el-row>
            <el-row>
              <el-col :span="18">
                <el-table
                    :data="editForm.userData" 
                    :border="true"
                    class="usertable"
                    style="font-size: 12px;text-align: center; color: #333333;"
                    v-bind:style="{width:'371px'}">
                    <el-table-column prop="index" label="序号" width="70px" align="center">
                    </el-table-column>
                    <el-table-column prop="userId" label="用户ID" width="100px" align="center">
                    </el-table-column>
                    <el-table-column prop="userName" label="用户姓名" width="100px" align="center">
                    </el-table-column>
                    <el-table-column label="管理" width="100px" align="center">
                        <template slot-scope="scope">
                          <el-button
                            size="mini"
                            icon="el-icon-delete"
                            type="text"
                            style="width: 10px;height: 10px;color:#3FAF98;"
                            @click="handleEditUserDelete(scope.$index, scope.row)"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
              </el-col>
               <el-col :span="1"><div style=""><el-button type="text" size="small" icon="el-icon-plus" @click="handleAddUser('editForm')"></el-button></div></el-col>
               <!-- 表格下方分页 -->
              <el-col :span="3">
                <div class="userpagination" style="text-align:center" v-show="userPaginationVisible">
                    <el-pagination
                      @current-change="handleEditUserCurrentChange"
                      :page-size="5"
                      background
                      :total="editForm.totalUserCount"
                      layout="prev, slot, next"
                      :current-page.sync="editForm.currentUserPage">
                      <div style="margin-top:10px;margin-bottom: 10px;color: #3FAF98">{{this.editForm.currentUserPage}}</div>
                    </el-pagination>
                </div>
              </el-col>
            </el-row>
            <el-row style="margin-top:20px">
              <el-col :span="18">
                <el-table
                    :data="editForm.fenceData" 
                    :border="true"
                    class="usertable"
                    style="font-size: 12px;text-align: center; color: #333333;"
                    tooltip-effect="dark"
                    v-bind:style="{width: '371px'}">
                    <el-table-column prop="index" label="序号" width="70px">
                    </el-table-column>
                    <el-table-column prop="fenceName" label="围栏名称" width="100px">
                    </el-table-column>
                    <el-table-column prop="fenceDes" label="描述"  width="100px">
                    </el-table-column>
                    <el-table-column label="管理" width="100px">
                        <template slot-scope="scope">
                          <el-button
                            size="mini"
                            icon="el-icon-delete"
                            type="text"
                            style="width: 10px;height: 10px;color:#3FAF98;"
                            @click="handleEditFenceDelete(scope.$index, scope.row)"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
              </el-col>
              <el-col :span="1"><div style=""><el-button type="text" size="small" icon="el-icon-plus" @click="handleAddFence('editForm')"></el-button></div></el-col>
              <!-- 表格右侧分页 -->
              <el-col :span="3">
                <div class="userpagination" style="text-align:center" v-show="fencePaginationVisible">
                    <el-pagination
                      small
                      @current-change="handleEditFenceCurrentChange"
                      background
                      :page-size="5"
                      :total="editForm.totalFenceCount"
                      layout="prev, slot, next"
                      :current-page.sync="editForm.currentFencePage">
                      <div style="margin-top:10px;margin-bottom: 10px;color: #3FAF98">{{this.editForm.currentFencePage}}</div>
                    </el-pagination>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-form-item label="" :label-width="formLabelWidth" >
                <el-button style="width:200px; margin-top:50px" type="primary" @click="submitEdit()">保 存</el-button>
              </el-form-item>
            </el-row>
        </el-form>
      </el-dialog>
      <!-- 添加用户 -->
      <el-dialog title="添加用户"   :visible.sync="addUser"
          :closeOnClickModal="false" 
          width="300px"
          class="manaDialog"
          :close-on-click-modal="false" 
          :close-on-press-escape="false"
          @close="resetForm('userForm')">
          <el-form :model='userForm' ref="userForm">
            <!--数据筛选条件+按钮-->
            <el-row>
              <el-form :inline="true" v-model="userForm" ref="userForm">
                <el-form-item>
                  <el-input v-model.trim="userForm.userId" prop="userId" placeholder="用户ID" clearable style="width:80px"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-input v-model.trim="userForm.userName" prop="userName"  placeholder="用户名" clearable style="width:80px"></el-input>
                </el-form-item>
                <el-form-item> 
                  <el-button type="primary" @click="getAllUserFro()" style="width:60px;height:20px;font-size:12px">查询</el-button>
                </el-form-item>
              </el-form>
            </el-row>
            <el-row>
                <el-table
                    :element-loading-text="loadingText"
                    element-loading-spinner="el-icon-loading"
                    :data="userForm.userData" 
                    ref="multipleTable"
                    @selection-change="handleUserSelectionChange"
                    :border="true"
                    style="font-size: 12px;text-align: center; color: #333333;"
                    v-bind:style="{width:'251px'}">
                    <el-table-column prop="index" type="selection" label="序号" width="50px" align="center">
                    </el-table-column>
                    <el-table-column prop="userId" label="用户ID" width="100px" align="center">
                    </el-table-column>
                    <el-table-column prop="userName" label="用户姓名" width="100px" align="center">
                    </el-table-column>
                </el-table>
               <!-- 表格下方分页 -->
                <div class="" style="text-align:center; margin-top: 15px;" v-show="true">
                    <el-pagination
                      @current-change="handleAddUserCurrentChange"
                      background
                      :page-size="5"
                      :total="userForm.totalUserCount"
                      layout="prev, pager, next"
                      :current-page.sync="userForm.currentUserPage">
                    </el-pagination>
                </div>
            </el-row>
            <el-row>
              <el-form-item>
                <el-button style="width:80px; margin-top:15px; margin-left:95px" type="primary" @click="submitUserAddToGroup()">保 存</el-button>
              </el-form-item>
            </el-row>
        </el-form>
      </el-dialog>
      <!-- 添加围栏 -->
      <el-dialog title="添加围栏"   :visible.sync="addFence"
          :closeOnClickModal="false" 
          width="300px"
          class="manaDialog"
          :close-on-click-modal="false" 
          :close-on-press-escape="false"
          @close="resetForm('fenceForm')">
          <el-form :model='fenceForm' ref="fenceForm">
            <!--数据筛选条件+按钮-->
            <el-row>
              <el-form :inline="true" v-model="fenceForm" ref="fenceForm">
                <el-form-item>
                  <el-input v-model.trim="fenceForm.fenceId" prop="fenceId" placeholder="围栏ID" clearable style="width:80px"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-input v-model.trim="fenceForm.fenceName" prop="fenceName"  placeholder="围栏名称" clearable style="width:80px"></el-input>
                </el-form-item>
                <el-form-item> 
                  <el-button type="primary" @click="getAllFenceFro()" style="width:60px;height:20px;font-size:12px">查询</el-button>
                </el-form-item>
              </el-form>
            </el-row>
            <el-row>
                <el-table
                    :element-loading-text="loadingText"
                    element-loading-spinner="el-icon-loading"
                    :data="fenceForm.fenceData" 
                    ref="multipleTable"
                    @selection-change="handleFenceSelectionChange"
                    :border="true"
                    class="usertable"
                    style="font-size: 12px;text-align: center; color: #333333;"
                    v-bind:style="{width:'251px'}">
                    <el-table-column prop="index" type="selection" label="序号" width="50px" align="center">
                    </el-table-column>
                    <el-table-column prop="fenceId" label="围栏ID" width="100px" align="center">
                    </el-table-column>
                    <el-table-column prop="fenceName" label="围栏名称" width="100px" align="center">
                    </el-table-column>
                    <el-table-column prop="fenceDes" label="围栏描述" width="100px" align="center">
                    </el-table-column>
                </el-table>
               <!-- 表格下方分页 -->
                <div class="userpagination" style="text-align:center" v-show="true">
                    <el-pagination
                      @current-change="handleAddFenceCurrentChange"
                      background
                      :page-size="15"
                      :total="fenceForm.totalFenceCount"
                      layout="prev, pager, next"
                      :current-page.sync="fenceForm.currentFencePage">
                    </el-pagination>
                </div>
            </el-row>
            <el-row>
              <el-form-item label="" :label-width="formLabelWidth" >
                <el-button style="width:80px; margin-top:10px;margin-right:20px" type="primary" @click="submitFenceAddToGroup()">保 存</el-button>
              </el-form-item>
            </el-row>
        </el-form>
      </el-dialog>
    </div>
</template>
<script>
import userapi from '@/api/userAbout/api.js'
import api from '@/api/hardware/api.js'
// import '../../static/css/gateMana/common.css'
// import '../../static/css/gateMana/dianziweilan.css'
export default {
  created () {
    console.log('111111111111')
    this.getUserGroupFro()
    for (let i = 0; i < 15; i++) {
      this.filterFormFro.tableData.push({
        index: i + 1,
        groupId: i + 1,
        groupName: i + 1,
        description: i + 1,
        adminName: i + 1,
        adminId: i + 1,
        userNum: i + 1,
        fenceNum: i + 1
      })
    }
    for (let i = 0; i < 15; i++) {
      // this.editForm.userData.push({
      //   index: i + 1,
      //   userId: i + 1,
      //   userName: i + 1
      // })
      // this.editForm.fenceData.push({
      //   index: i + 1,
      //   fenceId: i + 1,
      //   fenceName: i + 1,
      //   fenceDecs: i + 1
      // })
      this.userForm.userData.push({
        index: i + 1,
        userId: i + 1,
        userName: i + 1
      })
      this.fenceForm.fenceData.push({
        index: i + 1,
        fenceId: i + 1,
        fenceName: i + 1
      })
    }
    // this.getAllUserFro()
    // console.log('!!!!!!!!!!!!!')
  },
  data () {
    return {
      testData: [],
      filterFormFro: {
        tableData: [],
        totalCount: 15
      },
      userForm: {
        userId: '',
        userName: '',
        userData: [],
        totalUserCount: 15,
        currentUserPage: 1
      },
      fenceForm: {
        fenceId: '',
        fenceName: '',
        currentFencePage: 1,
        totalFenceCount: 15,
        fenceData: []
      },
      editForm: {
        userData: [],
        fenceData: [],
        groupId: '',
        groupName: '',
        adminId: '',
        adminName: '',
        currentUserPage: 1,
        currentFencePage: 1,
        totalFenceCount: 15,
        totalUserCount: 15
      },
      addForm: {
        userData: [],
        fenceData: [],
        groupName: '',
        adminId: '',
        adminName: '',
        currentUserPage: 1,
        currentFencePage: 1,
        totalFenceCount: 15,
        totalUserCount: 15
      },
      filterForm: {
        fenceId: '',
        fenceName: '',
        queryCondition: '',
        queryContent: '',
        currentPage: 1
      },
      tableWidth: '', // 表格宽度
      loadingText: '正在拼命加载中，请稍等......',
      loading: false,
      addUser: false,
      addFence: false,
      addVisable: false,
      editVisable: false,
      paginationVisible: true, // 表格下方的分页显示
      userPaginationVisible: true,
      fencePaginationVisible: true,
      formLabelWidth: '150px',
      deleteForm: {
        groupId: ''
      },
      list: [],
      states: [],
      fileList: [],
      userData: [],
      options: [{
        value: '1',
        label: '分组D'
      }, {
        value: '2',
        label: '分组名称'
      }],
      adminOptions: [],
      multipleUserSelection: [],
      multipleFenceSelection: [],
      withCredentials: true,
      processing: false,
      uploadTip: '点击上传',
      formFlag: 0,
      form: '',
      dialogImportVisible: false,
      errorResults: []
    }
  },
  methods: {
    /** ********************************* 页面处理数据格式等函数 ************************************************ */
    // 分页页面跳转时
    handleCurrentChange (val) {
      this.filterForm.currentPage = val
      this.getUserGroupFro(this.filterForm.currentPage)
    },
    // 分页页面跳转时
    handleEditUserCurrentChange (val) {
      this.editForm.currentUserPage = val
      this.getUserFro(this.editForm.currentUserPage)
    },
    // 分页页面跳转时
    handleEditFenceCurrentChange (val) {
      this.editForm.currentFencePage = val
      this.getFenceFro(this.editForm.currentFencePage)
    },
    // 分页页面跳转时
    handleAddUserCurrentChange (val) {
      this.addForm.currentUserPage = val
      this.getUserFro(this.addForm.currentUserPage)
    },
    // 分页页面跳转时
    handleAddFenceCurrentChange (val) {
      this.addForm.currentFencePage = val
      this.getFenceFro(this.addForm.currentFencePage)
    },
    // 编辑用户组弹窗-添加用户表格多选
    handleUserSelectionChange (val) {
      this.multipleUserSelection = val
    },
    // 编辑用户组弹窗-添加围栏表格多选
    handleFenceSelectionChange (val) {
      this.multipleFenceSelection = val
    },
    handleAddUser (form) {
      this.addUser = true
      this.multipleUserSelection = []
      this.form = form
    },
    handleAddFence (form) {
      this.addFence = true
      this.multipleFenceSelection = []
      this.form = form
    },
    // 设置表头样式
    tableHeaderClassName ({row, column, rowIndex, columnIndex}) {
      if (rowIndex === 0) {
        return 'headerClass'
      }
    },
    // 设置表格每一行样式
    tableRowClassName ({row, rowIndex}) {
      return 'rowClass'
    },
    // 点击表格中的“编辑”按钮
    handleEdit (index, row) {
      let data = this.filterFormFro.tableData[index]
      this.editForm.oldGroupName = data.groupName
      this.editForm.groupId = data.groupId
      this.editForm.description = row.description
      this.editForm.groupName = row.groupName
      this.editForm.adminId = row.adminId
      this.editForm.adminName = row.adminName
      // this.getFenceFro()
      // this.getUserFro()
      this.editVisable = true
    },
    // 点击表格中的“删除”按钮
    handleDelete (index, row) {
      let data = this.filterFormFro.tableData[index]
      this.deleteForm.groupId = data.groupId
      this.$confirm('确定删除该信息吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteUserGroupFro()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 编辑页面-点击用户表格中的“删除”按钮
    handleEditUserDelete (index, row) {
      this.editForm.userData.splice(index, 1)
    },
    // 添加页面-点击用户表格中的“删除”按钮
    handleAddUserDelete (index, row) {
      this.addForm.userData.splice(index, 1)
    },
    // 添加页面-点击围栏表格中的“删除”按钮
    handleAddFenceDelete (index, row) {
      this.addForm.fenceData.splice(index, 1)
    },
    // 编辑页面-点击围栏表格中的“删除”按钮
    handleEditFenceDelete (index, row) {
      this.editForm.fenceData.splice(index, 1)
    },
    // 重置表单
    resetError (formName) {
      this.$nextTick(function () {
        this.$refs[formName].resetFields()
      })
    },
    // 重置表单
    resetForm (formName) {
      this.$nextTick(function () {
        this.$refs[formName].resetFields()
      })
    },
    // 将时间转化为字符串(filterForm)
    formatDayFro (now) {
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
    handleChange (value, direction, movedKeys) {
      console.log(value, direction, movedKeys)
    },
     // 编辑用户组信息，点击“保存”
    submitEdit () {
      this.$refs['editForm'].validate((valid) => {
        if (valid) {
          this.editUserGroupFro()
        } else {
          return false
        }
      })
    },
    // 添加用户组信息，点击“保存”
    submitAdd () {
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          this.addUserGroupFro()
        } else {
          return false
        }
      })
    },
    // 编辑用户组信息-添加用户，点击“保存”
    submitUserAdd () {
      this.$refs['editForm'].validate((valid) => {
        if (valid) {
          this.editUserGroupFro()
        } else {
          return false
        }
      })
    },
    // 编辑用户组信息-添加新用户到用户组，点击“保存”
    submitUserAddToGroup () {
      this.$refs[this.form].validate((valid) => {
        if (valid) {
          this.addUserToGroup(this.form)
        } else {
          return false
        }
      })
    },
    // 编辑用户组信息-添加新围栏到用户组，点击“保存”
    submitFenceAddToGroup () {
      this.$refs[this.form].validate((valid) => {
        if (valid) {
          this.addFenceToGroup(this.form)
        } else {
          return false
        }
      })
    },
    // 管理员下拉列表
    adminRemoteMethod (query) {
      if (query !== '') {
        userapi.getAllAdmin({}).then(res => {
          if (res.data.result === 1000) {
            let data = res.data.content
            if (data.list.length > 0) {
              this.adminOptions = data.list
            }
          } else {
            this.$message.error(res.resultDesp)
          }
        }).catch(error => {
          this.$message.error(error)
        })
      }
    },
    getAdminId (form) {
      for (let i = 0; i < this.adminOptions.length; i++) {
        if (this[form].adminName === this.adminOptions[i].adminName) {
          this[form].adminId = this.adminOptions[i].adminId
          break
        }
      }
    },
    /** ***************************** 向后台发送请求 ***************************************** */
    // 查询用户组信息
    getUserGroupFro (pageNum) {
      this.loading = true
      let para = {
        pageSize: 15,
        pageNum: parseInt(this.filterForm.currentPage)
      }
      pageNum ? this.filterForm.currentPage = pageNum : this.filterForm.currentPage = 1
      if (this.filterForm.queryCondition && this.filterForm.queryContent !== '') {
        if (this.filterForm.queryCondition === '1') {
          para.groupId = parseInt(this.filterForm.queryContent)
        } else {
          para.groupName = this.filterForm.queryContent
        }
      } else {
        para.groupId = null
        para.groupName = null
      }
      userapi.getUserGroup(para).then(res => {
        this.filterFormFro.tableData = []
        this.loading = false
        if (res.data.result === 1000) {
          let data = res.data.content
          data.allPages > 1 ? this.paginationVisible = true : this.paginationVisible = false
          if (data.list.length > 0) {
            this.filterFormFro.tableData = data.list
            // this.filterFormFro.totalCount = data.allCount
            for (let i = 0; i < this.filterFormFro.tableData.length; i++) {
              this.filterFormFro.tableData[i].index = (this.filterForm.currentPage - 1) * 15 + i + 1
            }
          } else {
            this.$message.warning('没有查到任何用户组信息')
          }
        } else {
          this.$message.error(res.resultDesp)
        }
      }).catch(error => {
        this.loading = false
        this.$message.error(error)
      })
    },
    // 查询用户组的用户信息
    getUserFro (pageNum) {
      let para = {
        // pageSize: 15,
        // pageNum: parseInt(this.editForm.currentUserPage),
        userGroupId: this.editForm.userGroupId
      }
      pageNum ? this.editForm.userCurrentPage = pageNum : this.editForm.userCurrentPage = 1
      userapi.getUser(para).then(res => {
        this.editForm.userData = []
        this.loading = false
        if (res.result === 1000) {
          let data = res.content
          data.allPages > 1 ? this.userPaginationVisible = true : this.userPaginationVisible = false
          if (data.list.length > 0) {
            this.testData = data.list
            this.editForm.userData = data.list
            this.editForm.totalUserCount = data.allCount
            for (let i = 0; i < this.editForm.userData.length; i++) {
              // this.editForm.userData[i].index = (this.editForm.currentUserPage - 1) * 15 + i + 1
              this.editForm.userData[i].index = i + 1
            }
          } else {
            this.$message.warning('没有查到任何用户信息')
          }
        } else {
          this.$message.error(res.resultDesp)
        }
      }).catch(error => {
        this.$message.error(error)
      })
    },
    // 查询所有用户信息
    getAllUserFro () {
      let para = {
        // pageSize: 15,
        // pageNum: parseInt(this.editForm.currentUserPage),
        userId: this.userForm.userId,
        userName: this.userForm.userName
      }
      console.log(para)
      // userapi.getUser(para).then(res => {
      //   if (res.result === 1000) {
      //     data = res.content.list
      //     this.userForm.userData = res.content.list
      //   }
      // })
    },
    // 查询用户组的围栏信息
    getFenceFro (pageNum) {
      this.loading = true
      let para = {
        pageSize: 5,
        pageNum: parseInt(this.editForm.currentFencePage)
      }
      pageNum ? this.editForm.currentFencePage = pageNum : this.editForm.currentFencePage = 1
      para.groupName = this.editForm.groupName
      console.log('表格查询围栏')
      console.log(para)
      api.getFence(para).then(res => {
        this.editForm.fenceData = []
        if (res.result === 1000) {
          let data = res.content
          data.allPages > 1 ? this.fencePaginationVisible = true : this.fencePaginationVisible = false
          if (data.list.length > 0) {
            this.editForm.fenceData = data.list
            this.editForm.totalFenceCount = data.allCount
            for (let i = 0; i < this.editForm.fenceData.length; i++) {
              this.editForm.fenceData[i].index = (this.editForm.currentFencePage - 1) * 15 + i + 1
            }
          } else {
            this.$message.warning('没有查到任何围栏信息')
          }
        } else {
          this.$message.error(res.resultDesp)
        }
      }).catch(error => {
        this.$message.error(error)
      })
    },
    // 查询所有围栏信息
    getAllFenceFro () {
      let para = {
        pageSize: 15,
        pageNum: parseInt(this.editForm.currentFencePage),
        fenceId: this.fenceForm.fenceId,
        fenceName: this.fenceForm.fenceName
      }
      console.log(para)
      // api.getFence(para).then(res => {
      //   if (res.result === 1000) {
      //     data = res.content.list
      //     this.fenceForm.fenceData = res.content.list
      //   }
      // })
    },
    // 编辑用户组信息
    editUserGroupFro () {
      let para = {
        description: this.editForm.description,
        groupName: this.editForm.groupName,
        oldGroupName: this.editForm.oldGroupName,
        groupId: this.editForm.groupId,
        adminId: this.editForm.adminId,
        adminName: this.editForm.adminName,
        fenceSet: [],
        userSet: []
      }
      var fenceName = new Set()
      var userName = new Set()
      for (let i = 0; i < this.editForm.fenceData.length; i++) {
        fenceName.add(this.editForm.fenceData[i].fenceId)
        userName.add(this.editForm.userData[i].userId)
      }
      para.fenceSet = fenceName
      para.userSet = userName
      console.log(para)
      userapi.editUserGroup(para).then(res => {
        if (res.result === 1000) {
          this.editVisable = false
          this.$message.success('编辑用户组信息成功')
          this.getUserGroupFro()
        } else {
          this.$message.warning(res.resultDesp)
        }
      }).catch(error => {
        this.editVisable = false
        this.$message.error(error)
      })
    },
    // 添加用户组信息
    addUserGroupFro () {
      let para = {
        description: this.addForm.description,
        groupName: this.addForm.groupName,
        adminId: parseInt('1'),
        adminName: 'admin',
        fenceSet: [],
        userSet: []
      }
      var fenceName = new Set()
      var userName = new Set()
      for (let i = 0; i < this.addForm.userData.length; i++) {
        userName.add(this.addForm.userData[i].userId)
      }
      for (let i = 0; i < this.addForm.fenceData.length; i++) {
        fenceName.add(this.addForm.fenceData[i].fenceId)
      }
      para.fenceSet = fenceName
      para.userSet = userName
      console.log(para)
      // userapi.addUserGroup(para).then(res => {
      //   if (res.result === 1000) {
      //     this.addVisable = false
      //     this.$message.success('添加用户组信息成功')
      //     this.getUserGroupFro()
      //   } else {
      //     this.$message.warning(res.resultDesp)
      //   }
      // }).catch(error => {
      //   this.editVisable = false
      //   this.$message.error(error)
      // })
    },
    // 添加用户到用户组并刷新弹出框中的用户表格，去重
    addUserToGroup (form) {
      let length = this[form].userData.length
      console.log('用户多选')
      console.log(this.multipleUserSelection)
      console.log(this.addForm.userData)
      for (let i = 0; i < this.multipleUserSelection.length; i++) {
        for (let j = 0; j < this.userForm.userData.length; j++) {
          if (this.multipleUserSelection[i].index === this.userForm.userData[j].index) {
            this[form].userData.push({
              index: length + i + 1,
              userId: this.userForm.userData[j].userId,
              userName: this.userForm.userData[j].userName
            })
          }
        }
      }
      this.multipleUserSelection = []
      this.addUser = false
    },
    // 添加围栏到用户组并刷新弹出框中的用户表格，去重
    addFenceToGroup (form) {
      let length = this[form].fenceData.length
      for (let i = 0; i < this.multipleFenceSelection.length; i++) {
        for (let j = 0; j < this.fenceForm.fenceData.length; j++) {
          if (this.multipleFenceSelection[i].index === this.fenceForm.fenceData[j].index) {
            this[form].fenceData.push({
              index: length + i + 1,
              fenceId: this.fenceForm.fenceData[j].fenceId,
              fenceName: this.fenceForm.fenceData[j].fenceName,
              fenceDes: this.fenceForm.fenceData[j].fenceDes
            })
          }
        }
      }
      this.multipleFenceSelection = []
      this.addFence = false
    },
    // 硬件信息-删除用户组信息
    deleteUserGroupFro () {
      let para = {
        groupId: parseInt(this.deleteForm.groupId)
      }
      console.log(para)
      userapi.deleteUserGroup(para).then(res => {
        if (res.result === 1000) {
          this.deleteVisable = false
          this.$message.success('删除用户组信息成功')
          this.getUserGroupFro()
        } else {
          this.$message.warning(res.resultDesp)
        }
      }).catch(error => {
        this.deleteVisable = false
        this.$message.error(error)
      })
    }
  },
  mounted () {
    this.tableWidth = document.body.scrollWidth - 259 - 20
  }
}
</script>
<style scoped>
.hide-dialog{
  display:none;
}
.usertable .el-button{
  width:40px;
  height:10px;
}
.userpagination{
    margin: 0px;
    /*text-align: right;*/
}
.el-col {
    border-radius: 40px;
  }
</style>
