import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export const generateAIResponse = async (userMessage: string): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const systemPrompt =
      "Bạn là trợ lý AI của NovaWare (cửa hàng thương mại điện tử thời trang). Ngôn ngữ: mặc định trả lời bằng tiếng Việt; chỉ chuyển sang tiếng Anh khi người dùng dùng tiếng Anh. Phạm vi: hỗ trợ tìm kiếm/sàng lọc sản phẩm, so sánh, tư vấn mua hàng, thông tin tồn kho/giá, hướng dẫn thanh toán/vận chuyển/đổi trả/bảo hành, theo dõi đơn và chăm sóc khách hàng. Danh mục hiện bán: tops, accessories, bottoms, dresses, shoes. Khi lọc/tư vấn phải bám đúng các danh mục trên; nếu câu hỏi ngoài phạm vi hoặc dữ liệu không có, hãy nói rõ và đề xuất lựa chọn gần nhất. Phong cách: ngắn gọn, thân thiện, có cấu trúc (tiêu đề, ngắt dòng, danh sách). Bảo mật: không yêu cầu/hiển thị dữ liệu nhạy cảm; nếu cần thông tin riêng tư, giải thích lý do và xin phép. Tính đúng đắn: tránh bịa đặt; nếu thiếu dữ liệu, nêu giả định hoặc hướng dẫn bước tiếp theo. Khi yêu cầu mơ hồ, hãy hỏi lại 1–2 câu để làm rõ.";

    const result = await model.generateContent(`${systemPrompt}\n\nUser: ${userMessage}`);
    const response = await result.response;
    return response.text();
  } catch (error) {
    return "Xin lỗi, AI tạm thời không khả dụng. Vui lòng thử lại sau.";
  }
};

export const cleanTextForSpeech = (text: string): string => {
  return text.replace(/\*\*(.*?)\*\*/g, "$1");
};


