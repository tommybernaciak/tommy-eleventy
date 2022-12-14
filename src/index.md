---
title: 'tommy'
layout: 'base.njk'
---
<h1 class="mb-2 text-2xl md:text-3xl font-semibold text-white">Hey!</h2>

<p>My name is Tommy and I currently work as a Front-end Developer and a Javascript Team Leader at BinarApps.</p>
<p>I am a professional Front-end Developer with over 8 years of solid experience. Started as a Ruby on Rails developer, worked as an Angular developer and currently I focus on React and Typescript for few years now.  I am a highly motivated and ambitious person with can-do attitude, very curious and hungry for knowledge, always learning. I like to take on challenging and complicated projects that will help me gain new skills and broaden my horizons.</p>
<p>I am open and curious, always trying to be better. I enjoy my work, I like to do a good job, write a clean code and build applications I can be proud of. I can help with building the team, have experience in recruitment and interviewing and managing a development team. If you are looking for a developer who will take the lead and be committed to a project - I can help you!</p>


<h2 class="mb-2 text-lg font-semibold text-white">Blog Posts:</h2>
<ul class="space-y-1 max-w-md text-gray-100">
{% for post in collections.publishedPostsByDate  %}
<li><time class="italic" datetime="{{ post.date }}">{{ post.data.date | formatDate }}</time>: <a class="font-semibold" href="{{ post.url }}">{{ post.data.title }}</a></li>
{% endfor %}
</ul>