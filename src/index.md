---
title: 'tommy'
layout: 'base.njk'
---

<p class="eyebrow">The Journal</p>
<h1 class="mt-1 mb-10">Latest posts</h1>

<ul class="list-none pl-0">
{% for post in collections.publishedPostsByDate  %}
<li class="py-8 border-b border-[#ece8e3]">
    <a href="{{ post.url }}" class="group block">
        <time class="eyebrow block mb-2" datetime="{{ post.date }}">{{ post.data.date | formatDate }}</time>
        <span class="block transition-opacity group-hover:opacity-70" style="font-family: 'Playfair Display', serif; color: #2b2b2b; font-size: 1.5rem; line-height: 1.3;">{{ post.data.title }}</span>
    </a>
</li>
{% endfor %}
</ul>