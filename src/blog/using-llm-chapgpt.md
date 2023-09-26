---
title: How to talk with Language Models
published: true
description: 
date: 2023-09-26
---

# How to talk with Language Models

Language models like ChatGPT have revolutionized the way we interact with artificial intelligence, enabling us to generate human-like text responses for various applications. However, to harness the full potential of these models, it's essential to understand how to communicate effectively with them. In this blog post, we'll dive into the guidelines presented in a recent video transcript on how to prompt language models successfully.

## Write Clear and Specific Instructions

The first principle is the importance of crafting clear and specific instructions for the language model. Here are some tactics that can be used.

### Use Delimiters
Delimiters are punctuation marks or symbols that separate distinct parts of the input. They help the model understand the context and purpose of each section. Delimiters can be triple backticks, quotes, XML tags, or other clear indicators.

Example:
```txt
> Summarize the text delimited by triple backticks into a single sentence.
```

### Ask for Structured Output
When you're interacting with ChatGPT, it's crucial to let the model know the format you expect the response in. To make the model's responses more structured and easily interpretable, request a specific format, such as JSON or HTML. This ensures consistency in the output.

Example:
```txt
> Generate a list of three made-up music album titles along with their authors and genres. 
Provide them in JSON format with the following keys: album ID, title, artist, and genre.
```

Example:
```txt
> Give me bullet points summarizing the advantages and disadvantages of autonomous vehicles.
```

### Check Assumptions
In cases where the task relies on certain assumptions, instruct the model to verify those assumptions first. This prevents unexpected or incorrect responses.

Example:
```txt
> You'll be provided with text delimited by triple quotes. 
If it contains a sequence of instructions, rewrite those instructions...
```

### Specify the response style

If you need a short and to-the-point response, mention it explicitly. By asking for conciseness, you guide the model to provide a summary without unnecessary details.

Example:
```txt
> Give me a concise summary of the main points in the article on artificial intelligence.
```

On the other hand, if you want a creative or imaginative response, you can indicate that in your prompt. In this case, you're encouraging the model to be more creative and narrative in its response.

Example:
```txt
> Imagine a world where humans can communicate with animals. 
Describe a day in the life of a person with this ability in a storytelling style.
```

### Few-Shot Prompting
Show the model examples of successful task executions before asking it to perform the actual task. This helps the model understand the desired style and approach.

Example: 
```txt
> Before we begin, let me show you a successful response to a similar task.

Task: Describe the process of making homemade pizza dough.
Response: Making homemade pizza dough is a straightforward process that involves 
mixing flour, water, yeast, sugar, and salt. Here are the steps...

Now, please provide instructions on how to make chocolate chip cookies from scratch.
```

In this brief prompt, you're introducing the concept of showing a successful example for context and then immediately transitioning to the actual task, which is to provide instructions for making chocolate chip cookies. This approach provides clarity to the model about your expectations for the response style.

## Give the Model Time to Think

The second principle highlights the need to allow the model to think and reason before providing a response. Here are tactics to implement it:

### Specify Steps

Break down complex tasks into steps and ask the model to perform each step sequentially. This gives the model more time to process and reason.

Example: 
```txt
>Write a comprehensive essay on the impact of technology on modern education.

Step 1: Provide an introduction outlining the significance of technology in education.
Step 2: Discuss how technology has transformed classroom learning.
Step 3: Examine the role of online resources and digital tools.
Step 4: Explore the advantages and disadvantages of technology in education.
Step 5: Offer a conclusion summarizing the key points.

Let's begin with Step 1. Please provide an introduction that sets the stage for the essay.
```
In this prompt, you've clearly outlined the task and then divided it into five specific steps. By starting with Step 1, you allow the model to focus on one part of the task at a time, which can lead to more organized and coherent responses. This approach also helps in ensuring that the model covers all the necessary aspects of the complex task systematically.

### Instruct the Model to Reason

Instead of immediately asking for a final answer, instruct the model to work out its own solution before coming to a conclusion. This reduces errors and promotes accurate responses.

Example: 
```txt
>Work out your own solution to the problem, 
then compare your solution to the student's solution 
and evaluate if it's correct or not.
```

### Understanding Model Limitations

Understanding the limitations of language models is essential. While these models have access to extensive knowledge, they can sometimes produce inaccuracies or entirely fictional information, a phenomenon referred to as hallucination. For instance, a language model might erroneously generate statistics about a fictional disease or historical events that never occurred. To address this issue, one approach is to ask the model to substantiate its responses with quotes from credible source documents. This not only helps ensure the accuracy of the information but also reduces the risk of hallucinatory content creeping into the responses.

## Conclusion

Effective communication with language models is a skill that can greatly enhance the utility of these powerful AI tools. By following the principles of clear and specific instructions and giving the model time to think, you can improve the accuracy and relevance of the responses you receive. Understanding the model's limitations and using appropriate tactics can further enhance the quality of interactions. As you apply these guidelines, you'll unlock the full potential of language models like ChatGPT.

Stay tuned for more insights into mastering the art of prompting language models!