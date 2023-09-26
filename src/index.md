---
title: 'tommy'
layout: 'base.njk'
---

<h2 class="mb-2 text-lg font-semibold text-white">Blog Posts:</h2>
<ul class=" text-gray-100 text-sm md:text-xl">
{% for post in collections.publishedPostsByDate  %}
<a href="{{ post.url }}">
    <li class="flex justify-between mb-8 border-b-2">
        <time class="italic text-xs md:text-sm" datetime="{{ post.date }}">{{ post.data.date | formatDate }}</time> 
        <p class="font-semibold">{{ post.data.title }}</p>
    </li>
</a>
{% endfor %}
</ul>