<template>
  <div class="wrap">
    <div class="header-wrap">
      <div class="title">
        类目名称
      </div>
      <div class="number">类目数量</div>
      <div class="oprtion">
        操作
      </div>
    </div>
    <el-tree
      :data="all_tag_list"
      :expand-on-click-node="false"
      :indent="20"
      node-key="id"
      :default-expanded-keys="array"
    >
      <span slot-scope="{ node, data }" class="custom-tree-node">
        <span class="node-label">{{ data.name }}</span>
        <span class="node-length" v-if="(data.children || []).length > 0">{{
          (data.children || []).length
        }}</span>
        <span class="node-opration">
          <el-button
            type="text"
            v-if="
              data.name == '兴趣特长' ||
              data.name == '皮肤属性' ||
              data.name == '头发属性' ||
              data.name == '饮食健康' ||
              data.name == '身材属性' ||
              node.parent.data.name == '评价标签' ||
              node.parent.data.name == '皮肤属性' ||
              node.parent.data.name == '头发属性' ||
              node.parent.data.name == '身材属性' || //新加的标签
                node.parent.data.name == '饮食健康' //新加的标签
            "
            :disabled="authList.indexOf('1603870903') < 0"
            @click="addLabel(data, node)"
            >添加标签</el-button
          >
          <el-button
            type="text"
            v-if="
              data.name !== '用户评价' &&
              data.name !== '兴趣特长' &&
              data.name !== '博主类目' &&
              data.name !== '用户画像' &&
              data.name !== '皮肤属性' &&
              data.name !== '头发属性' &&
              data.name !== '身材属性' && //新加的标签
              data.name !== '饮食健康' && //新加的标签
                data.name !== '系统标签' &&
                data.name !== '评价标签' &&
                node.parent.data.name !== '评价标签' &&
                node.parent.data.name !== '博主类目' &&
                node.parent.data.name !== '系统标签' &&
                node.parent.data.name !== '行为标签' &&
                node.parent.data.name !== '博主段位' &&
                node.parent.data.name !== '用户等级'
            "
            @click="editBtnClick(data, node)"
            :disabled="authList.indexOf('1603870903') < 0"
            >编辑标签</el-button
          >
          <el-button
            type="text"
            v-if="
              data.name !== '系统标签' &&
              data.name !== '兴趣特长' &&
              data.name !== '用户评价' &&
              data.name !== '博主类目' &&
              data.name !== '用户画像' &&
              data.name !== '皮肤属性' &&
              data.name !== '头发属性' &&
              data.name !== '身材属性' && //新加的标签
              data.name !== '饮食健康' && //新加的标签
              data.name !== '系统标签' &&
              data.name !== '评价标签' &&
              node.parent.data.name !== '评价标签' &&
              node.parent.data.name !== '皮肤属性' &&
              node.parent.data.name !== '头发属性' &&
              node.parent.data.name !== '身材属性' && //新加的标签
              node.parent.data.name !== '饮食健康' && //新加的标签
                node.parent.data.name !== '博主类目' &&
                node.parent.data.name !== '系统标签' &&
                node.parent.data.name !== '行为标签' &&
                node.parent.data.name !== '博主段位' &&
                node.parent.data.name !== '用户等级'
            "
            @click="delBtnClick(data, node)"
            :disabled="authList.indexOf('1603870903') < 0"
            >删除标签</el-button
          >
        </span>
      </span>
    </el-tree>

    <!-- 添加标签dialog -->
    <el-dialog title="添加标签" :visible.sync="dialogCate" width="50%">
      <el-form label-width="100px" :model="tagInfo" ref="tagInfo">
        <!-- 标签名称 -->
        <el-form-item label="标签名称">
          <el-input
            v-model.trim="category.tag_name"
            maxlength="10"
            @keydown.native="keydown($event)"
            style="width:195px"
          ></el-input>
        </el-form-item>
        <div
          v-show="
            name != '私享标签' &&
              name != '星选标签' &&
              name != '兴趣特长' &&
              addlevel != 3
          "
        >
          <!-- 包一个dev控制总的出现 -->
          <el-form-item label="选择类型">
            <el-select v-model="addchoice" @change="typeChange">
              <el-option :value="1" label="单选"></el-option>
              <el-option :value="2" label="多选"></el-option>
            </el-select>
          </el-form-item>
          <!-- 单选要出现的框 -->
          <el-form-item label="是否归为基本属性" v-if="addchoice == 1">
            <el-select v-model="tagInfo.page" @change="basicChange">
              <el-option :value="1" label="是"></el-option>
              <el-option :value="0" label="否"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="多选数量" v-if="addchoice == 2">
            <el-input-number
              v-model="tagInfo.select_num"
              :min="2"
            ></el-input-number>
          </el-form-item>
          <!-- 上传图标的框 -->
          <div v-if="addchoice == 2 || tagInfo.page == 0">
            <el-form-item
              label="上传图标"
              prop="tag_image"
              :rules="{
                required: true,
                message: '请上传图标',
                trigger: 'blur,change'
              }"
            >
              <p>156*156像素，PNG格式，小于1M</p>
              <upload-img
                :width="100"
                :height="100"
                v-model="tagInfo.tag_image"
              ></upload-img>
              <div>点击前</div>
            </el-form-item>
            <el-form-item prop="tag_select_image">
              <upload-img
                :width="100"
                :height="100"
                v-model="tagInfo.tag_select_image"
              ></upload-img>
              <div>点击后</div>
            </el-form-item>
          </div>
        </div>
        <!-- 上传图标的框 -->
        <el-form-item
          label="关联兴趣"
          v-if="name == '私享标签' || name == '星选标签'"
        >
          <el-select v-model="category.relate_tags" multiple value-key="id">
            <el-option
              :value="item.id"
              multiple
              v-for="item in interest_tag_list"
              :label="item.name"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          label="关联类目"
          v-if="
            name == '皮肤属性' ||
              name == '头发属性' ||
              name == '身材属性' ||
              name == '饮食健康'
          "
        >
          <el-cascader
            v-model="category.category"
            v-if="dialogCate"
            separator="-"
            :props="defaultParams"
          ></el-cascader>
        </el-form-item>

        <el-form-item>
          <el-button @click="saveBtnClick" type="primary">确认提交</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 添加标签dialog -->
    <!-- 删除类目dialog -->
    <el-dialog title="删除标签" :visible.sync="dialogDel" width="33%">
      <span>
        确认删除
        <span style="color:blue"> {{ delmessage.category_name }}</span
        >这个标签？
      </span>
      <p>标签删除后,会影响该标签在数据库的数据,请谨慎操作</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogDel = false">取 消</el-button>
        <el-button type="primary" @click="deleteLabel({ id: category.tag_id })"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 删除类目dialog -->

    <!-- 编辑类目dialog -->
    <el-dialog title="编辑标签" :visible.sync="dialogCateEdit">
      <el-form label-width="100px">
        <el-form-item label="标签ID">
          <el-input
            v-model="category.tag_id"
            disabled
            style="width:195px"
          ></el-input>
        </el-form-item>
        <el-form-item label="标签级数">
          <el-select
            v-model="category.level"
            :disabled="category.tag_id != '0'"
          >
            <el-option :value="1" label="一级类目"></el-option>
            <el-option :value="2" label="二级类目"></el-option>
            <el-option :value="3" label="三级类目"></el-option>
            <el-option :value="4" label="四级类目"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属标签">
          <el-select
            v-model="parentName"
            disabled
            @change="$forceUpdate()"
          ></el-select>
        </el-form-item>
        <el-form-item label="标签名称">
          <el-input
            v-model.trim="category.tag_name"
            maxlength="10"
            @keydown.native="keydown($event)"
            style="width:195px"
          ></el-input>
        </el-form-item>
        <div
          v-show="
            parentName != '私享标签' &&
              parentName != '星选标签' &&
              parentName != '兴趣特长' &&
              level != 4
          "
        >
          <el-form-item label="选择类型">
            <el-select v-model="choice" @change="typeChange">
              <el-option :value="1" label="单选"></el-option>
              <el-option :value="2" label="多选"></el-option>
            </el-select>
          </el-form-item>
          <!-- 单选要出现的框 -->
          <el-form-item label="是否归为基本属性" v-show="choice == 1">
            <el-select v-model="tagInfo.page" @change="basicChange">
              <el-option :value="1" label="是"></el-option>
              <el-option :value="0" label="否"></el-option>
            </el-select>
          </el-form-item>
          <!-- 多选要出现的框 -->
          <el-form-item label="多选数量" v-show="choice == 2">
            <el-input-number
              v-model="tagInfo.select_num"
              :min="2"
            ></el-input-number>
          </el-form-item>
          <!-- 上传图标的框 -->
          <div v-if="choice == 2 || tagInfo.page == 0">
            <el-form-item
              label="上传图标"
              v-show="
                parentName == '皮肤属性' ||
                  parentName == '头发属性' ||
                  parentName == '身材属性' ||
                  parentName == '饮食健康'
              "
            >
              <p>156*156像素，PNG格式，小于1M</p>
              <upload-img
                :width="100"
                :height="100"
                v-model="tagInfo.tag_image"
              ></upload-img>
              <div>上传前</div>
            </el-form-item>
            <el-form-item
              v-show="
                parentName == '皮肤属性' ||
                  parentName == '头发属性' ||
                  parentName == '身材属性' ||
                  parentName == '饮食健康'
              "
            >
              <upload-img
                :width="100"
                :height="100"
                v-model="tagInfo.tag_select_image"
              ></upload-img>
              <div>上传后</div>
            </el-form-item>
          </div>
        </div>
        <!-- 上传图标的框 -->
        <!-- 关联兴趣 -->
        <el-form-item
          label="关联兴趣"
          v-if="parentName == '私享标签' || parentName == '星选标签'"
        >
          <el-select v-model="category.relate_tags" multiple value-key="id">
            <el-option
              :value="item.id"
              v-for="item in interest_tag_list"
              :label="item.name"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="关联类目"
          v-if="
            parentName == '皮肤属性' ||
              parentName == '头发属性' ||
              parentName == '身材属性' ||
              parentName == '饮食健康' ||
              level == 4
          "
        >
          <el-cascader
            v-if="dialogCateEdit"
            v-model="category.category"
            :props="defaultParams"
            separator="-"
            :options="cascaderOptions"
          ></el-cascader>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="editConfirm">确认</el-button>
          <el-button @click="dialogCateEdit = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 编辑类目dialog -->
  </div>
</template>

<script>
import UploadImg from "../../components/UploadImg";
export default {
  components: {
    UploadImg
  },
  data() {
    return {
      //级联选择器所需要的参数
      defaultParams: {
        checkStrictly: true,
        multiple: true,
        lazy: true,
        lazyLoad: this.lazyLoad,
        value: "id",
        label: "label",
        leaf: "leaf"
      },
      tableData: [], //列表数据
      all_tag_list: [],
      isExpand: true,
      dialogCate: false,
      dialogDel: false,
      dialogCateEdit: false, //编辑弹框
      category_name: [],
      category_array: [],
      cascaderOptions: [],
      array: [],
      // cateOptions: [], //编辑的时候使用
      level: "", //编辑的时候显示级别数
      addlevel: "", //添加的时候显示级别数
      delmessage: {},
      parentName: "", //根据父id来获取父级id名称
      name: "", //控制添加按钮点击 是否显示
      parent_id: "",
      parentId: "", //编辑时候查询用的
      page: "",
      type: "",
      category: {
        name: "", //标签名称
        tag_name: "", //编辑框的标签名称
        level: "", //级别
        tag_id: "", //标签id
        relate_tags: [], //关联兴趣
        category: []
      },
      tagInfo: {
        page: 1,
        select_num: 2,
        tag_image: "",
        tag_select_image: ""
      },
      addchoice: 1, //添加弹窗的选择类型
      choice: 1, //编辑窗口的选择类型
      interest_tag_list: []
    };
  },
  computed: {
    authList() {
      return this.$store.getters.getAuthList;
    }
  },
  mounted() {
    this.listCate();
  },
  methods: {
    async lazyLoad(node, resolve) {
      let cate = undefined;
      if (this.dialogCateEdit || this.dialogCate) {
        cate = [...this.category.category].find(item => {
          return item[item.length - 1] == node.value;
        });
      }
      if (cate) {
        this.category.category.push(cate);
      }
      this.category.category = Array.from(new Set(this.category.category));
      const { level } = node;
      let req = {
        parent_id: this.parentId.toString(),
        category_id: level == 0 ? "0" : node.data.id.toString()
      };
      let res = {
        error_code: 0,
        data: {
          List: []
        }
      };
      if (node.root || (node.hasChildren && node.children.length == 0)) {
        res = await this.$api.getTagBackCategoryList(req);
      }
      if (res.data == null) {
        res.data = {
          List: []
        };
      }
      if (res.error_code == 0) {
        res.data.List = res.data.List || [];
        for (let i = 0; i < res.data.List.length; i++) {
          if (res.data.List[i].child_count == 0) {
            res.data.List[i].leaf = true;
          } else {
            res.data.List[i].leaf = false;
          }
        }
        if (node.children && node.children.length > 0) {
          resolve([]);
        } else {
          resolve([...res.data.List]);
          if (cate) {
            node.checked = true;
            this.category.category.push(cate);
            this.category.category = Array.from(
              new Set(this.category.category)
            );
          }
        }
      } else {
        resolve([]);
      }
    },
    initCascaderOptions(cateOptions) {
      this.category.category.forEach(item => {
        this.initNode(item, cateOptions);
      });
    },
    async initNode(node, list) {
      let curOptions = list || [];
      for (let i = 0; i < node.length; i++) {
        let category_id = node[i]; //类目id
        let parent_id = this.parentId; //当前标签id
        let curNode = curOptions.find(item => {
          return item.id == category_id;
        });
        if (curNode) {
          let req = {
            category_id: category_id.toString(),
            parent_id: parent_id.toString()
          };
          let res = await this.$api.getTagBackCategoryList(req);
          if (res.error_code == 0 && res.data && res.data.List) {
            const list = res.data.List || [];
            for (let i = 0; i < list.length; i++) {
              if (list[i].child_count == 0) {
                list[i].leaf = true;
              } else {
                list[i].leaf = false;
              }
            }
            this.$set(curNode, "children", list);
            curOptions = curNode.children;
            // this.initCascaderOptions(curNode.children);
          }
        }
      }
    },
    //防止标签名里面输入空格
    keydown(event) {
      if (event.keyCode == 32) {
        event.returnValue = false;
      }
    },
    //一上来先获取列表接口
    async listCate() {
      let res = await this.$api.userLabelList({}); //获取用户标签列表
      if (res.error_code == 0) {
        res.data.tag_list = JSON.parse(
          JSON.stringify(res.data.tag_list).replace(/son_list/g, "children")
        );
        this.all_tag_list = res.data.tag_list;
        this.interest_tag_list = this.getTags(res.data.tag_list, "兴趣特长");
      }
    },
    //点击添加标签按钮,弹框出现
    async addLabel(item, node) {
      this.node = node;
      this.category.tag_name = "";
      this.category.category = [];
      this.category.relate_tags = [];
      this.parentId = node.data.parent_id;
      this.addchoice = 1; //点击打开的时候重新变成单选的状态
      this.tagInfo = {
        tag_image: "",
        tag_select_image: "",
        page: 1,
        select_num: 2
      };
      this.name = item.name; //用来控制评价标签的添加弹框项展示
      this.addlevel = node.level;
      this.parent_id = item.id;
      this.type = item.type;
      //这一段代码是为了添加4级类目时，主动获取第三级类目下的关联类目
      if (this.addlevel == 3) {
        let params = {
          tag_id: this.parent_id.toString()
        };
        let res = await this.$api.getSelectedTagList(params);
        if (res.error_code == 0) {
          this.category.category = res.data.category || [];
          console.log(this.category.category);
        }
      }
      // 这一段代码是为了添加4级类目时，主动获取第三级类目下的关联类目
      if (this.addlevel == 3 && (item.children || []).length > 29) {
        //根据添加标签的级数和数量对添加进行限制，超过30个即不让弹框展示
        this.$message.warning("标签数量已达上限,不能创建");
        this.dialogCate = false;
      } else {
        this.dialogCate = true;
      }
    },
    cancel() {
      this.dialogCate = false;
    },
    //确认提交按钮
    saveBtnClick() {
      if (this.category.tag_name == "") {
        this.$message.error("请输入标签名称");
        return false;
      }
      let page;
      let select_num;
      if (
        this.name == "私享标签" ||
        this.name == "星选标签" ||
        this.addlevel == 3 ||
        this.name == "兴趣特长"
      ) {
        //如果是评价标签或者是加4级标签
        // relate_tags = this.category.relate_tag.map(String);
        page = 0;
        select_num = 0;
      } else {
        // if (this.category.category == "") {
        //   this.$message.error("请选择关联类目");
        //   return false;
        // }
        page = this.tagInfo.page == 1 && this.addchoice == 1 ? 1 : 0; //判断是否属于基础属性
        if (this.addchoice == 1) {
          select_num = 1;
        } else {
          select_num = this.tagInfo.select_num;
        }
        //控制图标的显示
        if (
          (page == 0 && this.tagInfo.tag_image == "") ||
          (page == 0 && this.tagInfo.tag_select_image == "")
        ) {
          this.$message.error("请上传图标");
          return false;
        }
      }

      let data = {
        parent_id: this.parent_id.toString(),
        type: this.type,
        name: this.category.tag_name,
        level: Number(this.addlevel + 1),
        select_num: select_num,
        page: page,
        tag_image: this.tagInfo.tag_image,
        tag_select_image: this.tagInfo.tag_select_image,
        relate_tags: this.category.relate_tags.map(String),
        category: this.category.category
      };
      this.addNewLabel(data);
    },
    //新增标签
    async addNewLabel(data) {
      this.array = [];
      let res = await this.$api.addNewLabel(data); //新增标签的接口
      if (res.error_code == 0) {
        this.$message.success("编辑成功");
        this.dialogCate = false;
        this.listCate();
        this.array.push(this.node.data.id);
      }
    },
    //获取兴趣特长或博主类目里的标签
    getTags(list, tag) {
      if (!list || list.length < 1) {
        return [];
      }
      for (let i in list) {
        let item = list[i];
        if (item.name == tag) {
          return item.children;
        }
        let son_result = this.getTags(item.children, tag);
        if (son_result.length > 0) {
          return son_result;
        }
      }
      return [];
    },
    // 删除标签弹框
    delBtnClick(item, node) {
      this.node = node;
      this.dialogDel = true;
      this.delmessage.category_name = item.name;
      this.category.tag_id = item.id.toString();
    },
    // 删除标签
    async deleteLabel(i) {
      this.array = [];
      let res = await this.$api.userLabelDel(i); //删除标签接口
      if (res.error_code == 0) {
        this.$message.success("删除成功");
        this.dialogDel = false;
        this.listCate();
        this.array.push(this.node.parent.data.id);
      }
    },
    //编辑标签
    async editBtnClick(item, node) {
      this.level = node.level;
      this.node = node;
      this.parentName = node.parent.data.name;
      this.parentId = node.data.parent_id;
      if (item.select_num > 1) {
        this.choice = 2;
      } else {
        this.choice = 1;
      }
      this.category = {
        tag_id: item.id,
        tag_name: item.name,
        level: this.level,
        relate_tags: item.relate_tags,
        category: []
      };
      this.tagInfo = {
        page: item.page,
        select_num: item.select_num,
        tag_image: item.tag_image,
        tag_select_image: item.tag_select_image
      };
      let params = {
        tag_id: this.category.tag_id.toString()
      };
      let res = await this.$api.getSelectedTagList(params);
      if (res.error_code == 0) {
        this.category.category = res.data.category || [];
        this.category_name = res.data.category_name || [];
        // this.category_array = Array.from(
        //   new Set(this.category.category.join(",").split(","))
        // );
        let cateArray = [];
        for (let i = 0; i < this.category.category.length; i++) {
          for (let j = 0; j < this.category.category[i].length - 1; j++) {
            cateArray.push(this.category.category[i][j]);
          }
        }
        cateArray = Array.from(new Set(cateArray));
        this.initOptions(cateArray);
      }
      if (item.relate_tags == null) {
        this.category.relate_tags = [];
      }
    },
    async initOptions(cateArray) {
      let req = {
        parent_id: this.node.data.parent_id.toString() || "0",
        category_id: "0"
      };
      let res = await this.$api.getTagBackCategoryList(req);
      if (res.error_code == 0 && res.data && res.data.List) {
        this.cascaderOptions = await this.loadOptions(
          res.data.List || [],
          cateArray
        );
        this.dialogCateEdit = true;
      }
    },
    //递归
    async loadOptions(category, cateArray) {
      let array = [];
      for (let i = 0; i < category.length; i++) {
        if (category[i].child_count == 0) {
          category[i].leaf = true;
        }
        if (category[i].child_count > 0 && cateArray.includes(category[i].id)) {
          let req = {
            parent_id: this.node.data.parent_id.toString() || "0",
            category_id: category[i].id.toString()
          };
          let res = await this.$api.getTagBackCategoryList(req);
          if (res.error_code == 0 && res.data && res.data.List) {
            category[i].children = await this.loadOptions(
              res.data.List,
              cateArray
            );
          }
        }
        array.push(category[i]);
      }
      return array;
    },
    // //编辑弹框确认按钮
    editConfirm() {
      if (this.category.tag_name == "") {
        this.$message.error("请输入标签名称");
        return false;
      }
      let page;
      let select_num;
      // if (
      //   this.level > 2 &&
      //   this.parentName !== "私享标签" &&
      //   this.parentName !== "星选标签" &&
      //   this.parentName !== "兴趣特长"
      // ) {
      //   if (this.category.category.length == 0) {
      //     this.$message.error("关联类目为必填项，请修改关联类目");
      //     return false;
      //   }
      // }
      if (
        this.level == 4 ||
        this.parentName == "私享标签" ||
        this.parentName == "星选标签" ||
        this.parentName == "兴趣特长"
      ) {
        select_num = 0;
        page = 0;
      } else {
        page = this.tagInfo.page == 1 && this.choice == 1 ? 1 : 0;
        if (this.choice == 1) {
          select_num = 1;
        } else {
          select_num = this.tagInfo.select_num;
        }
        if (
          (page == 0 && this.tagInfo.tag_image == "") ||
          (page == 0 && this.tagInfo.tag_select_image == "")
        ) {
          this.$message.error("请上传图标");
          return false;
        }
      }
      let params = {
        id: this.category.tag_id.toString(),
        name: this.category.tag_name, //标签名
        relate_tags: this.category.relate_tags.map(String), //关联标签
        tag_image: this.tagInfo.tag_image,
        tag_select_image: this.tagInfo.tag_select_image,
        select_num: select_num,
        page: page,
        category: this.category.category
      };
      this.userLabelModify(params);
    },
    async userLabelModify(params) {
      this.array = [];
      let res = await this.$api.userLabelModify(this.$initReq(params)); //修改标签的接口
      if (res.error_code == 0) {
        this.dialogCateEdit = false;
        this.$message.success("修改成功");
        this.listCate();
        this.array.push(this.node.data.id);
      }
    },
    typeChange() {
      this.tagInfo = {
        tag_image: "",
        tag_select_image: "",
        page: 1,
        select_num: 2
      };
    },
    basicChange() {
      this.tagInfo.tag_image = "";
      this.tagInfo.tag_select_image = "";
    }
  }
};
</script>

<style lang="less">
.wrap {
  .el-tree-node__content {
    height: 40px;
    border-bottom: 1px solid #e6e6e6;
  }
}
</style>

<style lang="less" scoped>
.wrap {
  margin: 20px 20px 0;
  border: 1px solid #e6e6e6;
  border-bottom: none;
}
.header-wrap {
  display: flex;
  padding: 0 10px;
  height: 40px;
  line-height: 40px;
  border-bottom: 1px solid #e6e6e6;
  > .title {
    flex: 1;
  }
  > .number {
    width: 200px;
  }
  > .oprtion {
    width: 200px;
  }
}
.block {
  margin-top: 40px;
}
.custom-tree-node {
  width: 100%;
  display: inline-flex;
  align-items: center;
  font-size: 14px;
  padding-right: 10px;
}
.node-label {
  flex: 1;
}
.node-length {
  width: 200px;
}
.node-opration {
  width: 200px;
}
</style>
