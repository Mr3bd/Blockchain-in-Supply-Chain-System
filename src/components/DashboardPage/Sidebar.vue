<template>
	<aside :class="`${is_expanded ? 'is-expanded' : ''}`">


		<div class="menu-toggle-wrap">
			<button class="menu-toggle" @click="ToggleMenu">
				<span class="material-icons">keyboard_double_arrow_right</span>
			</button>
		</div>

		<h3 style="font-weight: 600; color: #00a36c;">Menu</h3>
		<div class="menu">
			<router-link v-if="HasPermission('getNotifications') " to="/dashboard/notifications" class="button">
				<span class="material-icons">notifications</span>
				<span class="text">Notifications</span>
				<span v-if="user.unReadNoti > 0" class="counter">{{ user.unReadNoti }}</span>

			</router-link>
			<router-link to="/dashboard/users" class="button">
				<span class="material-icons">group</span>

				<template v-if="user.id == null">
					<span class="text">Team</span>
				</template>
				<template v-else>
					<span class="text">Users</span>
				</template>

			</router-link>
			<router-link v-if="HasPermission('getMaterials')" to="/dashboard/materials" class="button">
				<span class="material-icons">list</span>
				<span class="text">Materials</span>
			</router-link>
			<router-link v-if="HasPermission('getProducts')" to="/dashboard/products" class="button">
				<span class="material-icons">inventory_2</span>
				<span class="text">Products</span>
			</router-link>

			<router-link v-if="HasPermission('getQARequests')" to="/dashboard/qarequests" class="button">
				<span class="material-icons">receipt_long</span>
				<span class="text">QA Requests</span>
			</router-link>
			<router-link v-if="HasPermission('getStoreProducts')" to="/dashboard/store" class="button">
				<span class="material-icons">local_mall</span>
				<span class="text">Store</span>
			</router-link>
			<router-link v-if="HasPermission('getOrders')" to="/dashboard/orders" class="button">
				<span class="material-icons">grading</span>
				<span class="text">Orders</span>
			</router-link>
			<router-link v-if="HasPermission('getShippingRequests')" to="/dashboard/shippingrequests" class="button">
				<span class="material-icons">local_shipping</span>
				<span class="text">Shipping Requests</span>
			</router-link>
			<router-link v-if="HasPermission('getSystemLogs')" to="/dashboard/systemlogs" class="button">
				<span class="material-icons">description</span>
				<span class="text">System Logs</span>
			</router-link>
			<!-- <router-link to="/addproduct" class="button">
				<span class="material-icons">description</span>
				<span class="text">Add Product</span>
			</router-link>
			<router-link to="/addproduct" class="button">
				<span class="material-icons">group</span>
				<span class="text">Add Product</span>
			</router-link>
			<router-link to="/addproduct" class="button">
				<span class="material-icons">email</span>
				<span class="text">Add Product</span>
			</router-link> -->
		</div>

		<div class="flex"></div>

		<div class="menu">
			<!-- <router-link to="/addproduct" class="button">
				<span class="material-icons">settings</span>
				<span class="text">Settings</span>
			</router-link> -->
		</div>
	</aside>
</template>

<script setup>
import { ref } from 'vue'
import { user } from '@/globalVariables';

const is_expanded = ref(localStorage.getItem("is_expanded") === "true")

const ToggleMenu = () => {
	is_expanded.value = !is_expanded.value
	localStorage.setItem("is_expanded", is_expanded.value)
}

</script>
<script>
import { user } from '@/globalVariables';

const HasPermission = (role) => {
	console.log(role);
	console.log(user.value.permissions == null);
	if (user.value === null)
	{
		return false;
	}
	else if (user.value.permissions == null)
	{
		return false;
	}
	else if (user.value.role_info.role_id == 1) {
		return true;
	}
	else {
		return user.value.permissions.includes(role);
		
	}
}
</script>

<style lang="scss" scoped>
aside {
	display: flex;
	flex-direction: column;
	background: linear-gradient(180deg, #0a2048 0%, #007046 100%);
	//background-color: var(--dark);
	color: var(--light);

	width: calc(2rem + 32px);
	overflow: hidden;
	min-height: 100vh;
	padding: 1rem;

	transition: 0.2s ease-in-out;

	.flex {
		flex: 1 1 0%;
	}

	// .dashboard-logo {
	// 	display: inline-flex;
	// 	margin-bottom: 1rem;

	// 	img {
	// 		width: 2rem;
	// 		margin-right: 16px;
	// 	}
	// }

	.menu-toggle-wrap {
		display: flex;
		justify-content: flex-end;
		margin-bottom: 1rem;
		position: relative;
		top: 0;
		transition: 0.2s ease-in-out;

		.menu-toggle {
			transition: 0.2s ease-in-out;

			.material-icons {
				font-size: 2rem;
				color: var(--light);
				transition: 0.2s ease-out;
			}

			&:hover {
				.material-icons {
					color: var(--primary);
					transform: translateX(0.5rem);
				}
			}
		}
	}

	h3,
	.button .text {
		opacity: 0;
		transition: opacity 0.3s ease-in-out;
	}

	h3 {
		color: var(--grey);
		font-size: 0.875rem;
		margin-bottom: 0.5rem;
		text-transform: uppercase;
	}

	.menu {
		margin: 0 -1rem;

		.button {
			display: flex;
			align-items: center;
			text-decoration: none;

			transition: 0.2s ease-in-out;
			padding: 0.5rem 1rem;

			.material-icons {
				font-size: 2rem;
				color: var(--light);
				transition: 0.2s ease-in-out;
			}

			.text {
				color: var(--light);
				transition: 0.2s ease-in-out;
			}

			&:hover {
				background-color: var(--dark-alt);

				.material-icons,
				.text {
					color: var(--primary);
				}
			}

			&.router-link-exact-active {
				background-color: #ffffff17;
				border-right: 5px solid var(--primary);

				.material-icons,
				.text {
					color: var(--primary);
					font-weight: 600;
				}
			}
		}
	}

	.footer {
		opacity: 0;
		transition: opacity 0.3s ease-in-out;

		p {
			font-size: 0.875rem;
			color: var(--grey);
		}
	}

	&.is-expanded {
		width: var(--sidebar-width);

		.menu-toggle-wrap {
			top: 0;

			.menu-toggle {
				transform: rotate(-180deg);
			}
		}

		h3,
		.button .text {
			opacity: 1;
		}

		.button {
			.material-icons {
				margin-right: 1rem;
			}
		}

		.footer {
			opacity: 0;
		}
	}

	@media (max-width: 1024px) {
		position: absolute;
		z-index: 99;
	}
}
.counter {
	background-color: #d52626;
	color: white;
	border-radius: 50%;
	width: 20px;
	height: 20px;
	text-align: center;
	line-height: 20px;
	margin-left: 10px;
	font-size: 12px;

}
</style>