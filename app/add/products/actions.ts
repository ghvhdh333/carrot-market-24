"use server";

import { z } from "zod";
import fs from "fs/promises";
import db from "@/lib/db";
import getSession from "@/lib/session/getSession";
import { redirect } from "next/navigation";
import {
  PHOTO_REQUIRED_ERROR,
  PHOTO_INVALID_TYPE_ERROR,
  TITLE_REQUIRED_ERROR,
  TITLE_INVALID_TYPE_ERROR,
  TITLE_MIN_LENGTH,
  TITLE_MIN_LENGTH_ERROR,
  TITLE_MAX_LENGTH,
  TITLE_MAX_LENGTH_ERROR,
  DESCRIPTION_REQUIRED_ERROR,
  DESCRIPTION_INVALID_TYPE_ERROR,
  DESCRIPTION_MIN_LENGTH,
  DESCRIPTION_MIN_LENGTH_ERROR,
  DESCRIPTION_MAX_LENGTH,
  DESCRIPTION_MAX_LENGTH_ERROR,
  PRICE_REQUIRED_ERROR,
  PRICE_INVALID_TYPE_ERROR,
  PRICE_MIN,
  PRICE_MIN_ERROR,
  PRICE_MAX,
  PRICE_MAX_ERROR,
} from "@/lib/constants";

const productSchema = z.object({
  photo: z.string({
    required_error: PHOTO_REQUIRED_ERROR,
    invalid_type_error: PHOTO_INVALID_TYPE_ERROR,
  }),
  title: z
    .string({
      required_error: TITLE_REQUIRED_ERROR,
      invalid_type_error: TITLE_INVALID_TYPE_ERROR,
    })
    .min(TITLE_MIN_LENGTH, TITLE_MIN_LENGTH_ERROR)
    .max(TITLE_MAX_LENGTH, TITLE_MAX_LENGTH_ERROR),
  description: z
    .string({
      required_error: DESCRIPTION_REQUIRED_ERROR,
      invalid_type_error: DESCRIPTION_INVALID_TYPE_ERROR,
    })
    .min(DESCRIPTION_MIN_LENGTH, DESCRIPTION_MIN_LENGTH_ERROR)
    .max(DESCRIPTION_MAX_LENGTH, DESCRIPTION_MAX_LENGTH_ERROR),
  price: z.coerce
    .number({
      required_error: PRICE_REQUIRED_ERROR,
      invalid_type_error: PRICE_INVALID_TYPE_ERROR,
    })
    .min(PRICE_MIN, PRICE_MIN_ERROR)
    .max(PRICE_MAX, PRICE_MAX_ERROR),
});

export async function uploadProduct(_: any, formData: FormData) {
  const data = {
    photo: formData.get("photo"),
    title: formData.get("title"),
    price: formData.get("price"),
    description: formData.get("description"),
  };

  if (data.photo instanceof File) {
    const photoData = await data.photo.arrayBuffer();
    await fs.appendFile(`./public/${data.photo.name}`, Buffer.from(photoData));
    data.photo = `/${data.photo.name}`;
  }
  const result = productSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    const session = await getSession();
    if (session.id) {
      const product = await db.product.create({
        data: {
          title: result.data.title,
          description: result.data.description,
          price: result.data.price,
          photo: result.data.photo,
          user: {
            connect: {
              id: session.id,
            },
          },
        },
        select: {
          id: true,
        },
      });
      redirect(`/products/${product.id}`);
    }
  }
}