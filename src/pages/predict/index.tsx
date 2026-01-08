import {
  get21DaysDataUsingGet,
  predict7DaysTrafficUsingPost,
} from "@/services/xybi/trafficDataController";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  message,
  Row,
  Select,
  Space,
  Table,
} from "antd";
import { useForm } from "antd/es/form/Form";
import dayjs from "dayjs";
import React, { useState } from "react";

/**
 * 智能预测
 * @returns
 */
const addChartAsync: React.FC = () => {
  const [form] = useForm();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [loading21Days, setLoading21Days] = useState<boolean>(false);
  const [trafficData, setTrafficData] = useState<API.TrafficHistory[]>([]);
  const [predictionResult, setPredictionResult] = useState<string | null>(null);

  // 预测提交
  const onPredictFinish = async (values: any) => {
    setSubmitting(true);
    try {
      // 处理日期格式
      if (values.date) {
        values.date = dayjs(values.date).format("YYYY-MM-DD");
      }

      // 调用后端预测接口
      const response = await predict7DaysTrafficUsingPost({
        city: values.city,
        startDate: values.date,
      });

      if (response.data) {
        // 解析响应数据
        const responseText = response.data.toString();

        // 使用正则表达式提取csvData和filename
        const csvDataMatch = responseText.match(
          /csvData=([\s\S]*)[,)]filename=/
        );
        const filenameMatch = responseText.match(/filename=([^)]+)\)/);

        let csvData = "";
        if (csvDataMatch) {
          csvData = csvDataMatch[1].trim();
        } else {
          // 如果正则匹配失败，尝试其他方式提取
          const startIdx = responseText.indexOf("csvData=") + 8;
          if (startIdx > 7) {
            const endIdx = responseText.lastIndexOf(", filename=");
            csvData = responseText.substring(startIdx, endIdx).trim();
          } else {
            csvData = responseText;
          }
        }

        // 保存预测结果
        setPredictionResult(csvData);
        message.success("预测成功！");

        // 创建 Blob 对象
        const blob = new Blob([csvData], {
          type: "text/csv;charset=utf-8;",
        });

        // 创建下载链接
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;

        // 生成文件名
        let fileName = `predictions_${values.city}_${
          values.date || new Date().toISOString().split("T")[0]
        }_7days.csv`;
        if (filenameMatch) {
          fileName = filenameMatch[1];
        }

        link.setAttribute("download", fileName);

        // 触发下载
        document.body.appendChild(link);
        link.click();

        // 清理
        link.remove();
        window.URL.revokeObjectURL(url);
      } else {
        message.error("预测失败，未收到有效的数据");
      }
    } catch (e: any) {
      console.error("预测失败:", e);
      message.error("预测失败," + (e.message || "请稍后重试"));
    } finally {
      setSubmitting(false);
    }
  };

  // 查询21天历史数据
  const fetch21DaysData = async (city: string) => {
    setLoading21Days(true);
    try {
      const response = await get21DaysDataUsingGet({
        city: city,
      });

      if (response) {
        // 处理数据以便表格显示
        setTrafficData(
          response.map((item, index) => ({
            key: index,
            ...item,
          }))
        );
      } else {
        message.error("获取历史数据失败");
      }
    } catch (e: any) {
      console.error("获取历史数据失败:", e);
      message.error("获取历史数据失败," + (e.message || "请稍后重试"));
    } finally {
      setLoading21Days(false);
    }
  };

  // 21天历史数据表单提交
  const onHistoryFinish = async (values: any) => {
    await fetch21DaysData(values.city);
  };

  // 定义表格列
  const columns = [
    {
      title: "城市",
      dataIndex: "city",
      key: "city",
    },
    {
      title: "日期",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "季节",
      dataIndex: "season",
      key: "season",
      render: (season: number) => {
        const seasonMap: Record<number, string> = {
          1: "春",
          2: "夏",
          3: "秋",
          4: "冬",
        };
        return seasonMap[season] || "未知";
      },
    },
    {
      title: "天气",
      dataIndex: "weatherType",
      key: "weatherType",
    },
    {
      title: "温度",
      dataIndex: "temperature",
      key: "temperature",
    },
    {
      title: "湿度",
      dataIndex: "humidity",
      key: "humidity",
    },
    {
      title: "节假日",
      dataIndex: "isHoliday",
      key: "isHoliday",
      render: (isHoliday: boolean) => (isHoliday ? "是" : "否"),
    },
  ];

  return (
    <div className="add-chart-async">
      <Row gutter={16}>
        <Col span={12}>
          <Card title="智能预测">
            <Form
              form={form}
              name="predictForm"
              labelAlign="left"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              onFinish={onPredictFinish}
              initialValues={{}}
            >
              <Form.Item
                name="city"
                label="预测城市"
                rules={[{ required: true, message: "请选择预测城市" }]}
              >
                <Select
                  placeholder="请选择预测城市"
                  options={[
                    { value: "北京", label: "北京" },
                    { value: "上海", label: "上海" },
                    { value: "深圳", label: "深圳" },
                    { value: "杭州", label: "杭州" },
                    { value: "南昌", label: "南昌" },
                  ]}
                />
              </Form.Item>

              <Form.Item
                name="date"
                label="预测开始日期"
                rules={[{ required: true, message: "请选择预测开始日期" }]}
              >
                <DatePicker
                  placeholder="请选择预测开始日期"
                  style={{ width: "100%" }}
                />
              </Form.Item>

              <Form.Item wrapperCol={{ span: 16, offset: 8 }}>
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={submitting}
                    disabled={submitting}
                  >
                    预测
                  </Button>
                  <Button htmlType="reset" onClick={() => form.resetFields()}>
                    重置
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col span={12}>
          <Card title="历史天气数据查询(21天)">
            <Form
              name="historyForm"
              labelAlign="left"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              onFinish={onHistoryFinish}
              initialValues={{}}
            >
              <Form.Item
                name="city"
                label="查询城市"
                rules={[{ required: true, message: "请选择查询城市" }]}
              >
                <Select
                  placeholder="请选择查询城市"
                  options={[
                    { value: "北京", label: "北京" },
                    { value: "上海", label: "上海" },
                    { value: "深圳", label: "深圳" },
                    { value: "杭州", label: "杭州" },
                    { value: "南昌", label: "南昌" },
                  ]}
                />
              </Form.Item>

              <Form.Item wrapperCol={{ span: 16, offset: 8 }}>
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading21Days}
                    disabled={loading21Days}
                    style={{ marginBottom: "55px" }}
                  >
                    查询
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
      {/* 显示21天历史数据表格 */}
      <div style={{ marginTop: 16 }}>
        <Card
          title={
            trafficData[0]
              ? `${trafficData[0].city}最近21天历史天气数据`
              : "所查询城市最近21天历史天气数据"
          }
        >
          <Table
            dataSource={trafficData}
            columns={columns}
            loading={loading21Days}
            pagination={{
              pageSize: 7,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条记录`,
            }}
          />
        </Card>
      </div>
    </div>
  );
};

export default addChartAsync;
