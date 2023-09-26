---
title: 'tommy'
layout: 'base.njk'
---

<h2 class="mb-2 text-lg font-semibold text-white">Blog Posts:</h2>
<ul class=" text-gray-100 text-sm md:text-xl">
{% for post in collections.publishedPostsByDate  %}
<li class="flex justify-between mb-8 border-b-2">
    <time class="italic" datetime="{{ post.date }}">{{ post.data.date | formatDate }}</time> 
    <a class="font-semibold" href="{{ post.url }}">{{ post.data.title }}</a>
</li>
{% endfor %}
</ul>