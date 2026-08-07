# JLPT N5 Mock Test System

এই প্যাকেজটি `n5-mock-tests.html`-এর ১০টি N5 Mock Test চালানোর জন্য তৈরি। মূল `index.html`-এ কোনো পরিবর্তন প্রয়োজন নেই।

## ব্যবহার

একই ফোল্ডারে এই তিনটি ফাইল রাখুন:

- `n5-mock-tests.html`
- `jlpt-exam.html`
- `n5-full-generator.js`

তারপর `n5-mock-tests.html` খুলুন। Mock Test 1 চাপলে Test 1, Mock Test 2 চাপলে Test 2—এভাবে প্রতিটি বাটন তার নিজস্ব প্রশ্নসেট খুলবে।

## পরীক্ষার flow

1. শব্দভাণ্ডার: ২৫টি প্রশ্ন একই পাতায় নিচে নিচে থাকবে। সব উত্তর দিয়ে পার্ট জমা দিতে হবে।
2. পার্ট জমা হওয়ার পরেই “পরবর্তী পার্ট শুরু করুন” বাটন আসবে। আগের পার্টে আর ফেরা যাবে না।
3. গ্রামার ও রিডিং: ৩০টি প্রশ্ন একই vertical feed-এ থাকবে। Reading passage-গুলো সংশ্লিষ্ট প্রশ্নের আগে grouped থাকবে।
4. এই পার্ট জমা হলে Listening খুলবে।
5. Listening: ২০টি প্রশ্ন; প্রতিটি audio সর্বোচ্চ দুইবার শোনা যাবে।
6. শেষ পার্ট জমা হলে ১৮০ নম্বরের ফলাফল, pass/fail এবং ৭৫টি প্রশ্নের বাংলা review দেখা যাবে।

## সুবিধা

- Todai-inspired mobile app layout
- প্রতি টেস্টে ৭৫টি প্রশ্ন; ১০টি আলাদা mock test
- Real Time: ২০ + ৪০ + ৩০ মিনিট
- Practice mode-এ সংক্ষিপ্ত timer
- উত্তর, বর্তমান পার্ট ও scroll position auto-save
- মাঝপথ থেকে Resume
- সময় শেষ হলে সেই পার্ট auto-submit
- Listening Sound Check ও Japanese browser voice
- ভুল/সঠিক উত্তর filter, transcript ও বাংলা ব্যাখ্যা

Listening-এর জন্য Android Chrome বা desktop Chrome ব্যবহার করলে সবচেয়ে ভালো ফল পাওয়া যায়।
