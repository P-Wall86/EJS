--Assignment 2
--1.Insert new 'client' record
INSERT INTO public.account (
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )
VALUES (
        'Tony',
        'Stark',
        'tony@starkent.com',
        'Iam1ronM@n'
    );
--2.Update 'client' to 'admin'
UPDATE public.account
SET account_type = 'Admin'
WHERE account_id = 1;
--3.Delete 'client' record
DELETE FROM public.account
WHERE account_id = 1;
--4.Update GM Hummer description snippet
UPDATE public.inventory
SET inv_description = REPLACE(
        inv_description,
        'small interiors',
        'a huge interior'
    )
WHERE inv_id = 10;
--5.Inner join for the 'Sport' category
SELECT i.inv_make,
    i.inv_model,
    c.classification_name
FROM public.inventory i
    INNER JOIN public.classification c ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';
--6.Update '/vehicles/' to the middle of the path for img and thumbnails
UPDATE public.inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');