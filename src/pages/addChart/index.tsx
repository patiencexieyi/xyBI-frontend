import { genChartByAiUsingPost } from "@/services/xybi/chartController";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { Button, Form, Input, message, Select, Space, Upload } from "antd";
import TextArea from "antd/es/input/TextArea";
import ReactECharts from "echarts-for-react";
import React, { useState } from "react";

const addChart: React.FC = () => {

  const [fileList, setFileList] = useState<any[]>([]);
  const [chart, setChart] = useState<API.BiResponse>();
  const [option, setOption] = useState<any>();
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
        const res = await genChartByAiUsingPost(
          params,
          {},
          values.file[0].originFileObj
        );
        console.log("res", res);
        if (!res?.data) {
          message.error("分析失败");
        } else {
          message.success("分析成功");
          try {
            // 将返回的图表配置字符串转换为对象
            const chartOptionStr = res.data.genChart ?? "{}";
            const chartOption = JSON.parse(chartOptionStr);

            // 验证是否为有效的ECharts配置对象（简单验证）
            if (typeof chartOption === "object" && chartOption !== null) {
              setChart(res.data);
              setOption(chartOption);
            } else {
              throw new Error("图表配置格式无效");
            }
          } catch (parseError: any) {
            message.error("图表配置解析失败: " + parseError.message);
          }
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
    <div className="add-chart">
      <Form
        // 表单名称改为addChart
        name="addChart"
        onFinish={onFinish}
        // 初始化数据啥都不填，为空
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

        <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
          <Space>
            <Button type="primary" htmlType="submit" loading={submitting} disabled={submitting}>
              智能分析
            </Button>
            <Button htmlType="reset">重置</Button>
          </Space>
        </Form.Item>
      </Form>
      <div>分析结论：{chart?.genResult}</div>
      <div>
        生成图表：
        {option && <ReactECharts option={option} />}
      </div>
    </div>
  );
};
export default addChart;