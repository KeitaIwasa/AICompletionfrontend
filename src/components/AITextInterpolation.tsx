import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from "./ui/button";
import { Textarea } from './ui/textarea';
import { RefreshCw, Copy, Check } from "lucide-react"
import axios from 'axios';  // axiosをインポート

// AI予測のバックエンド呼び出し関数
const getAIPrediction = async (text: string): Promise<string> => {
  try {
    const response = await axios.post('https://aicomletion.de.r.appspot.com/api/predict', { text });  // バックエンドのエンドポイントにリクエスト
    return response.data.prediction;
  } catch (error) {
    console.error('Error with AI prediction:', error);
    return '';
  }
};

export default function AITextInterpolation() {
  const [inputText, setInputText] = useState('');
  const [predictedText, setPredictedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false); // コピー状態を管理
  // テキストエリアにフォーカスを戻すためのrefを作成
  const textareaRef = useRef<HTMLDivElement>(null);

  // タイピング停止後0.5秒で予測を行う
  useEffect(() => {
    const handler = setTimeout(() => {
      const fetchPrediction = async () => {
        if (inputText.length > 3) {
          setLoading(true);
          const textToSend = inputText.length <= 200 ? inputText : inputText.slice(-200);
          const prediction = await getAIPrediction(textToSend);
          setPredictedText(prediction);
          setLoading(false);
        } else {
          setPredictedText('');
        }
      };

      fetchPrediction();
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [inputText]);

  // 予測結果を適用する
  const applyPrediction = useCallback(() => {
  setInputText((prevInputText) => prevInputText + predictedText);
  setPredictedText('');

  // 補完適用後にテキストエリアの内容を更新
  if (textareaRef.current) {
    textareaRef.current.textContent = inputText + predictedText;
    textareaRef.current.focus();
  }
}, [predictedText, inputText]);

  // リトライ機能
  const retryPrediction = useCallback(async () => {
    if (inputText.length > 5) {
      setLoading(true);
      const textToSend = inputText.length <= 300 ? inputText : inputText.slice(-300);
      const prediction = await getAIPrediction(textToSend);
      setPredictedText(prediction);
      setLoading(false);
    }
  }, [inputText]);

  // テキストをクリップボードにコピー
  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(inputText).then(() => {
      setCopied(true); // コピー成功時にアイコンを変更
      setTimeout(() => setCopied(false), 2000); // 2秒後にアイコンを元に戻す
    });
  }, [inputText]);

  // キーボードショートカットの処理
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Tab') {
      // 予測を適用
      applyPrediction();
      e.preventDefault();
    } else if (e.ctrlKey && (e.key === 'r' || e.key === 'R')) {
      // リトライ
      retryPrediction();
      e.preventDefault();
    }
  };

  const textareaStyle = {
    width: '100%',
    height: '200px',
    border: '1px solid #ccc',
    padding: '10px',
    overflow: 'auto',
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word' as 'break-word',
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">AI 文章補間</h1>
      <div
        contentEditable
        ref={textareaRef}
        onInput={(e) => setInputText(e.currentTarget.textContent || '')}
        onKeyDown={handleKeyDown}
        style={textareaStyle}
      >
        <span>{inputText}</span>
        <span
          style={{ color: 'gray' }} // 文字色を灰色に設定
          onClick={applyPrediction}
        >
          {predictedText}
        </span>
      </div>
      <div className="flex justify-end items-center mt-4 space-x-2">
        {/* コピー機能を追加 */}
        <Button
          onClick={copyToClipboard}
          className="p-2 bg-gray-400 text-gray-600 rounded hover:bg-gray-500 transition"
          title = "コピー"
        >
          {copied ? <Check /> : <Copy />}
        </Button>

        {/* リトライボタン */}
        <Button
          onClick={retryPrediction}
          className="p-2 bg-gray-400 text-gray-600 rounded hover:bg-gray-500 transition"
          title="リトライ"
        >
          <RefreshCw />
        </Button>
      </div>
    </div>
  );
}



