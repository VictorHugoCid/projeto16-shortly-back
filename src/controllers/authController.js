import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid';
import { db } from "../database/db.js";
import { stripHtml } from 'string-strip-html';