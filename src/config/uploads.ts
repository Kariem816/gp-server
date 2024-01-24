import { createUploadthing } from "uploadthing/express";
import { UTApi } from "uploadthing/server";

export const ut = createUploadthing();
export const utapi = new UTApi();
