---
title: 'tommy'
layout: 'base.njk'
---
<h1 class="mb-2 text-2xl md:text-3xl font-semibold text-white">Hey!</h2>

My name is Tommy and I am a software engineer and a web developer. Professional full stack developer with over 8 years of solid experience. Highly motivated and ambitious person with can-do attitude. Very curious and hungry for knowledge, always learning. I like to take on challenging and complicated projects that will help me gain new skills and broaden my horizons
I am open and curious, always trying to be better. I enjoy my work, I like to do a good job, write a clean code and build applications I can be proud of. I can help with building the team, have experience in recruitment and interviewing. If you are looking for a developer who will take the lead and be committed to a project - I can help you!


<h2 class="mb-2 text-lg font-semibold text-white">Blog Posts:</h2>
<ul class="space-y-1 max-w-md list-disc list-inside text-gray-100">
{% for post in collections.posts  %}
<li><time class="italic" datetime="{{ post.date }}">{{ post.data.date | formatDate }}</time> - <a class="font-semibold" href="{{ post.url }}">{{ post.data.title }}</a></li>
{% endfor %}
</ul>