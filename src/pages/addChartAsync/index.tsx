import { genChartByAiAsyncUsingPost } from "@/services/xybi/chartController";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import {
  Button,
  Card,
  Form,
  Input,
  message,
  Select,
  Space,
  Upload,
} from "antd";
import { useForm } from "antd/es/form/Form";
import TextArea from "antd/es/input/TextArea";
import React, { useState } from "react";

/**
 * 智能分析（异步）页面
 * @returns
 */
const addChartAsync: React.FC = () => {
  const [form] = useForm();
  const [fileList, setFileList] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState<boolean>(false);

  //提交
  const onFinish = async (values: any) => {
    // 避免重复提交
    if (submitting) {
      return;
    }
    setSubmitting(true);

    // 看看能否得到用户的输入
    console.log("表单内容: ", values);
    // 对接后端，上传数据
    const params = {
      ...values,
      file: undefined,
    };
    try {
      // 检查是否有文件再进行上传
      if (values.file && values.file.length > 0) {
        const res = await genChartByAiAsyncUsingPost(
          params,
          {},
          values.file[0].originFileObj
        );
        console.log("res", res);
        if (!res?.data) {
          message.error("分析失败");
        } else {
          message.success("分析任务提交成功，稍后请在我的图标页面查看");
        }
      }
    } catch (e: any) {
      message.error("分析失败," + e.message);
    }
    setSubmitting(false);
  };

  const uploadProps: UploadProps = {
    beforeUpload: (file) => {
      // 允许上传CSV和XLSX文件
      const isCSV = file.type === "text/csv" || file.name.endsWith(".csv");
      const isXLSX =
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.name.endsWith(".xlsx");

      if (!isCSV && !isXLSX) {
        message.error("只能上传CSV或XLSX文件!");
        return Upload.LIST_IGNORE;
      }
      return true;
    },
    onChange: (info) => {
      // 更新文件列表状态
      setFileList(info.fileList);
    },
    fileList, // 控制文件列表显示
    maxCount: 1, // 最多只能上传一个文件
  };

  return (
    <div className="add-chart-async">
      <Card title="智能分析">
        <Form
          form={form}
          name="addChart"
          labelAlign="left"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          onFinish={onFinish}
          initialValues={{}}
        >
          <Form.Item
            name="goal"
            label="分析目标"
            rules={[{ required: true, message: "请输入分析目标!" }]}
          >
            <TextArea placeholder="请输入你的分析需求，比如：分析网站用户的增长情况" />
          </Form.Item>
          <Form.Item name="name" label="图表名称">
            <Input placeholder="请输入图表名称" />
          </Form.Item>
          <Form.Item name="chartType" label="图表类型">
            <Select
              options={[
                { value: "折线图", label: "折线图" },
                { value: "柱状图", label: "柱状图" },
                { value: "堆叠图", label: "堆叠图" },
                { value: "饼图", label: "饼图" },
                { value: "雷达图", label: "雷达图" },
              ]}
            />
          </Form.Item>

          <Form.Item
            name="file"
            label="原始数据"
            valuePropName="fileList"
            getValueFromEvent={(e) => e.fileList}
          >
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>上传文件</Button>
            </Upload>
          </Form.Item>

          <Form.Item wrapperCol={{ span: 16, offset: 4 }}>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                disabled={submitting}
              >
                提交
              </Button>
              <Button htmlType="reset">重置</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
export default addChartAsync;
