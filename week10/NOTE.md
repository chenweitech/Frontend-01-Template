# 每周总结可以写在这里

# 使用 domAPI 将 dom 元素逆序

第一种：

```
<div id="a">
	<span>1</span>
	<span>2</span>
	<span>3</span>
	<span>4</span>
</div>

<script>
let element = document.getElementById("a");

function reverseChildren(element){
	let children = Array.prototype.slice.call(element.childNodes);

	element.innerHTML = "" // dom 会自动remove

	children.reverse();

	for(let child of children){
		element.appendChild(child)
	}
}
reverseChildren(element)
</script>
```

利用 dom 移动元素：

```js
<div id="a">
	<span>1</span>
	<span>2</span>
	<span>3</span>
	<span>4</span>
</div>

<script>
    let element = document.getElementById("a");

	 function reverseChildren(element){
         var l = element.childNodes.length;
         while(l-- >0){
             element.appendChild(element.childNodes[l])
         }
     }
	 reverseChildren(element);
</script>

```

利用 range 减少重排

```js
<div id="a">
	<span>1</span>
	<span>2</span>
	<span>3</span>
	<span>4</span>
</div>

<script>
    let element = document.getElementById("a");

	 function reverseChildren(element){
         let range = new Range();
         range.selectNodeContents(element); //选择

         let fragment = range.extractContents(); //拷贝

         var l = fragment.childNodes.length;
         while(l-- >0){
             fragment.appendChild(fragment.childNodes[l])
         }
         element.appendChild(fragment);
     }
	 reverseChildren(element);
</script>
```

## range API

```js
<div id="a">123<span style="background-color:pink">456789</span>0123456789</div>
 <script>
    let range = new Range();
	 range.setStart(document.getElementById("a").childNodes[0],3);
	 range.setEnd(document.getElementById("a").childNodes[2],3);
 </script>
```
