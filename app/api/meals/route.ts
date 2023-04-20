import { prisma } from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/app-beta";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { userId } = auth();

  if (!userId) return NextResponse.json([]);

  const cartData = await prisma.cart.findFirst({
    where: {
      userId: userId!,
    },
  });

  if (!cartData) return NextResponse.json([]);

  const cartProducts = await prisma.cartProduct.findMany({
    where: {
      cartId: cartData?.id,
    },
  });

  if (!cartProducts) return NextResponse.json([]);

  return NextResponse.json(cartProducts);
}

export async function POST(req: Request) {
  const { userId } = auth();
  const { id, name, image, price }: CartItem = await req.json();

  const productData = {
    id: id,
    name: name,
    image: image,
    price: Number(price),
    quantity: 1,
  };

  try {
    const cartData = await prisma.cart.findUnique({
      where: {
        userId: userId!,
      },
    });

    let cartProduct;

    const cartProductData = await prisma.cartProduct.findFirst({
      where: {
        cartId: cartData?.id,
        productId: productData.id,
        userId: userId!,
      },
    });

    if (cartData) {
      if (cartProductData) {
        cartProduct = await prisma.cartProduct.update({
          where: {
            id: cartProductData.id,
          },
          data: {
            quantity: cartProductData.quantity + 1,
          },
        });
      } else {
        cartProduct = await prisma.cartProduct.create({
          data: {
            cartId: cartData.id,
            productId: productData.id,
            userId: userId!,
            name: productData.name,
            image: productData.image,
            price: productData.price,
            quantity: productData.quantity,
          },
        });
      }
    } else {
      const cart = await prisma.cart.create({
        data: {
          userId: userId!,
          products: {},
        },
      });

      cartProduct = await prisma.cartProduct.create({
        data: {
          cartId: cart.id,
          productId: productData.id,
          userId: userId!,
          name: productData.name,
          image: productData.image,
          price: productData.price,
          quantity: productData.quantity,
        },
      });
    }

    return NextResponse.json("success");
  } catch (error) {
    console.log(error);
  }
}
