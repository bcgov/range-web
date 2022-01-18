with p as (

select count(pl.*) as plans, r.description, d.code
from plan pl
join agreement a on a.forest_file_id = pl.agreement_id
join ref_zone z on a.zone_id = z.id
join ref_agreement_type r on a.agreement_type_id = r.id
join ref_district d on d.id = z.district_id
group by d.code, r.description)

select count(a.*) as agreements, r.description,  p.plans,  d.code
from agreement a
join ref_zone z on a.zone_id = z.id
join ref_agreement_type r on a.agreement_type_id = r.id
join ref_district d on d.id = z.district_id
left join p on p.code = d.code and p.description = r.description
group by d.code, p.plans, r.description
order by d.code, r.description  asc;
