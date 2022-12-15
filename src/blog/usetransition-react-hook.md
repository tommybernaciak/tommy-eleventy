---
title: useTransition() React hook
published: true
description: 
date: 2022-06-22
---

# useTransition() React hook

In React all updates have the same priority by default. A heavy and non-urgent task can slow down a task that is light but urgent. With react 18 you can enable the concurrent mode which allows prioritizing UI updates.

## How it looks like

```jsx
const [isPending, startTransition] = useTransition();
```

`isPending` is a flag that allows you to do an action when the transition is pending.

`startTransition(callback)` allows you to mark any UI updates inside the callback as transitions.

## How it works

Here is an example component:

```jsx
function FilterList() {
	const [filterTerm, setFilterTerm] = useState('');
	const filteredProducts = filterProducts(filterTerm);

	const updateFilterHandler = (event) => {
		setFilterTerm(event.target.value);
	}

	return (
		<div>
			<input type="text" onChange={updateFilterHandler} />
			<ProductList products={filteredProducts} />
		</div>
	);
}
```

When the input is changed, the filter term is updated and a `filterProducts` function is fired. In this example component, the input can get slowed down by the expensive filtering function. Input change is an urgent task - the user must see changes while he types. On the other hand, showing an updated product list is a non-urgent task - users can wait a sec to see actual results. The `useTransition()` hook can help separate urgent input update from non-urgent list filtering updates.

```jsx
function FilterList() {
	const [isPending, startTransition] = useTransition();
	const [filterTerm, setFilterTerm] = useState('');
	const filteredProducts = filterProducts(filterTerm);

	const updateFilterHandler = (event) => {
		startTransition(() => {
			setFilterTerm(event.target.value);
		});
	}

	return (
		<div>
			<input type="text" onChange={updateFilterHandler} />
			{isPending ? 
				<p>Loading list...</p>
				: <ProductList products={filteredProducts} />
			}
		</div>
	);
}
```
Now text input will be updated immediately after the user type a new character while `ProductList` will show up when the filtering function finishes. Input is no longer blocked and slowed down by another component. With a `useTransition()` hook React UI updates can be easily prioritized. Did you find it useful for your project?